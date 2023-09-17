import pydicom
import numpy as np
import os
import sys

class DicomProcessor:
    def __init__(self):
        self.width = 32
        self.height = 32
        self.depth = 5
        self.INPUT_PATH = 'INPUT/'
        self.OUTPUT_PATH = 'OUTPUT/'
        self.FILENAME = ''
        # Configuración temporal, cambiar para leer desde archivo properties o similar
        self.x_start = 0
        self.y_start = 0
        self.z_start = 0
        self.debug = False
        self.dataset = None
        self.numpy_array = None

    def open_dicom(self):
        self.dataset = pydicom.dcmread(self.INPUT_PATH + self.FILENAME)
        self.numpy_array = self.dataset.pixel_array

        if self.debug:
            print("Frames:", self.dataset.NumberOfFrames)
            self.print_pixel_array(self.numpy_array)

    def cut_dicom(self):
        frames = self.dataset.NumberOfFrames
        if frames > 1:
            for frame in range(0, frames):
                recorte = self.numpy_array[frame, self.y_start:self.y_start + self.height, self.x_start:self.x_start + self.width]
                self.save(frame + 1, recorte)
        else:
            recorte = self.numpy_array[self.y_start:self.y_start + self.height, self.x_start:self.x_start + self.width]
            self.save(0, recorte)

    def save(self, frame, data):
        filename = self.FILENAME.split('.')[0] + "_" + str(frame) + ".npy"
        if not os.path.exists(self.OUTPUT_PATH):
            os.makedirs(self.OUTPUT_PATH)

        path = os.path.join(self.OUTPUT_PATH, filename)
        np.save(path, data)
        if self.debug:
            print(data)
            print(f"Frame {frame} saved in '{path}'")

    @staticmethod
    def print_pixel_array(pixel_array):
        for i in pixel_array:
            for j in i:
                print(j, end="")
            print("\n")

    def start(self):
        self.open_dicom()
        self.cut_dicom()

if __name__ == "__main__":
    dicom_processor = DicomProcessor()

    if len(sys.argv) != 5:
        print("Usage: python dicom_processor.py DICOM_FILE.DCM x y z")
    else:
        dicom_processor.FILENAME = sys.argv[1]
        dicom_processor.x_start = sys.argv[2]
        dicom_processor.y_start = sys.argv[3]
        dicom_processor.z_start = sys.argv[4]
        dicom_processor.start()