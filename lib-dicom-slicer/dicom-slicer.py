import pydicom
import numpy as np
import os
import sys

class DicomProcessor:
    def __init__(self):
        self.width = 32
        self.height = 32
        self.depth = 5
        self.OUTPUT_PATH = 'D:\JAVERIANA\TG\DICOM-Processor\lib-dicom-slicer\OUTPUT'
        self.FILENAME = ''
        # Configuración temporal, cambiar para leer desde archivo properties o similar
        self.x_start = 0
        self.y_start = 0
        self.z_start = 0
        self.debug = False
        self.dataset = None
        self.numpy_array = None

    def open_dicom(self):
        self.dataset = pydicom.dcmread(self.FILENAME)
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
        foldername = os.path.splitext(os.path.basename(self.FILENAME))[0]
        filename = foldername + "_" + str(frame) + ".npy"
        folder_path = os.path.join(self.OUTPUT_PATH, foldername)
        print('folder_path: ', folder_path)
        print('filename: ', filename)

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        file_path = os.path.join(folder_path, filename)
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

    def start(self):
        self.open_dicom()
        self.cut_dicom()

if __name__ == "__main__":
    dicom_processor = DicomProcessor()

    if len(sys.argv) != 5:
        print("Usage: python dicom_processor.py DICOM_FILE.DCM x y z")
    else:
        dicom_processor.FILENAME = sys.argv[1]
        dicom_processor.x_start = int(sys.argv[2])
        dicom_processor.y_start = int(sys.argv[3])
        dicom_processor.z_start = int(sys.argv[4])
        dicom_processor.start()