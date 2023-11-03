FROM python:3.8
WORKDIR /app
COPY . /app
RUN mkdir /app/LIDC-IDRI_images_npy_3d_HU_PRD
COPY Journal_SPIE_1S_2H_binary_kfold_fold_ /app/Journal_SPIE_1S_2H_binary_kfold_fold_
COPY LIDC-IDRI_images_npy_3d_HU /app/LIDC-IDRI_images_npy_3d_HU
RUN pip install einops kornia imageio opencv-python pandas scikit-learn torch torchvision torchaudio flask pyyaml matplotlib torchsummary seaborn
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
EXPOSE 4250
CMD ["python", "ms-nodule-classifier.py"]