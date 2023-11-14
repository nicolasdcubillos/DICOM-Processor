import traceback
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from slicer.slicer import Slicer
from repository.repository import DatabaseConnector  # Añade la importación de la nueva clase

class MsDicomSlicerController:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app, resources={r"/*": {"origins": "*"}})
        self.dicom_processor = None
        self.db_connector = DatabaseConnector()  # Crea una instancia de DatabaseConnector

    def run(self):
        if not self.dicom_processor:
            self.dicom_processor = Slicer()
        self.app.run(host="0.0.0.0", port=self.dicom_processor.config.get('port', 5000))

    @staticmethod
    def index(requested_path):
        print(f"Se intentó acceder a la ruta: {requested_path}")
        return f'Página no encontrada: {requested_path}', 404

    def slice(self):
        try:
            dicom_processor = Slicer()
            dicom_processor.params = self.db_connector.get_params()  # Usa el método de DatabaseConnector
            dicom_file = request.files.get('file', None)

            if dicom_file is None:
                return jsonify({'error': 'El archivo DICOM no se ha proporcionado'}), 400

            temp_file = tempfile.NamedTemporaryFile(delete=False)
            dicom_file.save(temp_file.name)
            dicom_processor.filename = temp_file.name
            dicom_processor.x_start = int(request.form.get('x'))
            dicom_processor.y_start = int(request.form.get('y'))
            dicom_processor.z_start = int(request.form.get('z'))
            dicom_processor.start()

            return jsonify({'message': dicom_processor.UUID}), 200
        except Exception as e:
            traceback_str = traceback.format_exc()
            print(e)
            print(traceback_str)
            return jsonify({'error': str(e), 'traceback': traceback_str}), 500

if __name__ == '__main__':
    controller = MsDicomSlicerController()
    controller.run()
