import sys
import os

packages_folder = os.path.join(os.path.dirname(__file__), 'packages')

# Añadir la carpeta 'packages' al sys.path
sys.path.append(packages_folder)

import pydicom
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import traceback
import uuid
import tarfile
from PIL import Image, ImageDraw
import os
import io
import base64
import tempfile
import boto3

# Local imports
from parameter_repository import get_params
from yml_config_loader import load_config

class DicomProcessor:
    
    def __init__(self):
        self.config = load_config()
        self.params = get_params()
        self.width = int(self.params.get('width', 32))
        self.height = int(self.params.get('height', 32))
        self.depth = int(self.params.get('depth', 5))
        self.OUTPUT_PATH = self.config.get('OUTPUT_PATH', '')
        self.filename = ''
        self.x_start = 0
        self.y_start = 0
        self.z_start = 0
        self.debug = self.params.get('debug', False)
        self.params = None
        self.dataset = None
        self.numpy_array = None
        self.UUID = None
        self.folder_path = None
        self.output_frames = None
        self.output_gz_file = None
        self.gz_filename = None
        self.session = boto3.Session(aws_access_key_id=self.config.get('AWS_ACCESS_KEY_ID', ''), aws_secret_access_key=self.config.get('AWS_SECRET_ACCESS_KEY', ''))

    def open_dicom(self):
        self.UUID = str(uuid.uuid4())
        self.dataset = pydicom.dcmread(self.filename)
        self.numpy_array = self.dataset.pixel_array

        if self.debug:
            print("Frames:", self.dataset.NumberOfFrames)
            self.print_pixel_array(self.numpy_array)

    def cut_dicom(self):
        if self.dataset.NumberOfFrames is None or self.dataset.NumberOfFrames == 0:
            x_min = max(0, self.x_start - self.width // 2)
            x_max = min(self.numpy_array.shape[1], self.x_start + self.width // 2)
            y_min = max(0, self.y_start - self.height // 2)
            y_max = min(self.numpy_array.shape[0], self.y_start + self.height // 2)
            recorte = self.numpy_array[y_min:y_max, x_min:x_max]
            self.save_npy(0, recorte)
        else:
            x_min = max(0, self.x_start - self.width // 2)
            x_max = min(self.numpy_array.shape[2], self.x_start + self.width // 2)
            y_min = max(0, self.y_start - self.height // 2)
            y_max = min(self.numpy_array.shape[1], self.y_start + self.height // 2)
            z_min = max(0, self.z_start - self.depth // 2)
            z_max = min(self.numpy_array.shape[0], self.z_start + self.depth // 2)
            indice = 0
            for z in range(z_min, z_max + 1):
                recorte = self.numpy_array[z, y_min:y_max, x_min:x_max]
                self.save_npy(indice, recorte)
                indice += 1
            self.output_frames = indice
                
    def load_folder(self):
        self.folder_path = os.path.join(self.OUTPUT_PATH, self.UUID)
        if not os.path.exists(self.folder_path):
            os.makedirs(self.folder_path)
            
    def save_npy(self, frame, data):     
        filename = self.UUID + "_" + str(frame) + ".npy"
        if self.debug:
            print('folder_path: ', self.folder_path)
            print('filename: ', filename)

        file_path = os.path.join(self.folder_path, filename)
        np.save(file_path, data)

        if self.debug:
            print(data)
            print(f"Frame {frame} saved in '{file_path}'")

    @staticmethod
    def print_pixel_array(pixel_array):
        for i in pixel_array:
            for j in i:
                print(j, end="")
            print("\n")
    
    def image_to_base64(self):
        ds = pydicom.dcmread(self.filename)
        pixel_array = ds.pixel_array[self.z_start]
        image = Image.fromarray(pixel_array).convert("RGB")
        draw = ImageDraw.Draw(image)
        circle_radius = int(self.params.get('circle_radius', 5))
        draw.ellipse((self.x_start - circle_radius, self.y_start - circle_radius,
                    self.x_start + circle_radius, self.y_start + circle_radius), outline=self.params.get('circle_color', 'red'), width=int(self.params.get('circle_width', 3)))

        buffered = io.BytesIO()
        image.save(buffered, format="PNG", compress_level=self.params.get('compress_level', 5))

        base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return base64_image

    def base64_to_png(self, base64_image):
        image_data = base64.b64decode(base64_image)
        png_path = os.path.join(self.folder_path, 'output_with_marker.png')
        with open(png_path, 'wb') as png_file:
            png_file.write(image_data)

        return png_path
            
    def save_metadata(self):
        metadata = {}
        metadata['UUID'] = self.UUID
        metadata['PatientName'] = self.dataset.PatientName
        metadata['StudyDescription'] = self.dataset.StudyDescription
        metadata['Frames'] = self.output_frames
        metadata['Preview'] = self.image_to_base64()
        # Agregar otros metadatos que desees extraer

        file_path = os.path.join(self.folder_path, 'metadata')
        
        with open(file_path, 'w') as metadata_file:
            for key, value in metadata.items():
                metadata_file.write(f'{key}: {value}\n')
                
    def gz_compression(self):
        files = [f for f in os.listdir(self.folder_path) if os.path.isfile(os.path.join(self.folder_path, f))]
        self.gz_filename = self.UUID + '.tar.gz'
        self.output_gz_file = os.path.join(self.OUTPUT_PATH, self.gz_filename)
        with tarfile.open(self.output_gz_file, 'w:gz') as tar_gz:
            for file in files:
                input_file_path = os.path.join(self.folder_path, file)
                tar_gz.add(input_file_path, arcname=file)

    def send_to_S3(self):
        s3_client = self.session.client('s3')

        with open(self.output_gz_file, 'rb') as file:
            s3_client.put_object(
            Bucket = self.config.get('S3_BUCKET_NAME', ''),
            Key = self.gz_filename,
            Body = file
            ) 

    def start(self):
        self.open_dicom()
        self.load_folder() # Preparar la carpeta para guardar salida
        self.cut_dicom()
        self.save_metadata()
        if self.params.get('gz_compression', True):
            self.gz_compression()
            if self.params.get('send_S3', True):
                self.send_to_S3()
        
# Servicio flask

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
dicom_processor = DicomProcessor()

@app.route('/api-ms-dicom-slicer/slice', methods=['POST'])
def slice():
    try:
        global dicom_processor

        if not dicom_processor:
            dicom_processor = DicomProcessor()
        
        dicom_processor.params = get_params()
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

@app.route('/', methods=['POST'])
def index():
    requested_path = request.path
    print(f"Se intentó acceder a la ruta: {requested_path}")
    return f'Página no encontrada: {requested_path}', 404

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = dicom_processor.config.get('port', 5000))