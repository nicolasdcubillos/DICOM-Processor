# -*- coding: utf-8 -*-
"""Journal_SPIE_binary_Ind_Inferences.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1ckHoPjJBFy3PccF9Jenfq1rNfNRiudbD
"""

#!pip install einops
#!pip install kornia

#Sugeridos
#pip install imageio
#pip install opencv-python
#pip install pandas
#pip install sklearn
#pip install torch torchvision torchaudio -f https://download.pytorch.org/whl/cu111/torch_stable.html
#pip install flask

import sys
import os
import math
import time
import random
import typing
import imageio
import cv2 as cv
import numpy as np
import csv
import pandas as pd
import traceback
from PIL import Image
from itertools import chain
from sklearn import metrics
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter
from einops.layers.torch import Rearrange
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify

import torch as T
import torchvision
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torchsummary import summary
from torch.optim.adam import Adam
from torch.utils.data import DataLoader
from torch.utils.data import TensorDataset
from torchvision import datasets, models, transforms
from torchvision.models.resnet import resnet50
from kornia.utils.one_hot import one_hot
from sklearn.model_selection import StratifiedKFold


import warnings
import seaborn as sns
from itertools import chain
from matplotlib.patches import Patch
from mpl_toolkits.axes_grid1.inset_locator import mark_inset
from sklearn.metrics import confusion_matrix, precision_recall_curve

"""## Load PTH
We previolusly obtained each PTH(weights) from a training process. Now it is neccesary to adquire the embeddings
"""

#from google.colab import drive
#drive.mount('/content/drive')
print(T.cuda.is_available())
root = os.getcwd()
print(root)

#weight_paths = "/content/drive/MyDrive/TG"
weight_paths = "D:\JAVERIANA\TG\Modelo\Multi-attention-nodule-classification\Journal_SPIE_binary_Ind_Inferences\Journal_SPIE_1S_2H_binary_kfold_fold_"
fold_weight_path = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold")
fold_weight_path_0 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_0.pth")
fold_weight_path_1 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_1.pth")
fold_weight_path_2 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_2.pth")
fold_weight_path_3 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_3.pth")
fold_weight_path_4 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_4.pth")
fold_weight_path_5 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_5.pth")
fold_weight_path_6 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_6.pth")
fold_weight_path_7 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_7.pth")
fold_weight_path_8 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_8.pth")
fold_weight_path_9 = os.path.join(root, weight_paths, "Journal_SPIE_1S_2H_binary_kfold_fold_9.pth")
print("Folder of PTH model: ", fold_weight_path_0)
print("Folder of PTH model: ", fold_weight_path)

"""## Loading each model
But, if we want to load the PTH, we need to do certain steps, such as declare each model

"""

def conv3x3_3d(in_planes, out_planes, stride=1):
    """3x3 convolution with padding"""
    return nn.Conv3d(in_planes, out_planes, kernel_size=(3, 3, 3), stride=stride, padding=1, bias=False)

class Basic3dBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes, planes, stride=1, downsample=None):
        super(Basic3dBlock, self).__init__()
        self.conv1 = conv3x3_3d(inplanes, planes, stride)
        self.bn1 = nn.BatchNorm3d(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = conv3x3_3d(planes, planes)
        self.bn2 = nn.BatchNorm3d(planes)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x):
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)
        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)

        return out

class BasicConv3dRBF(nn.Module):
    def __init__(self, in_planes, out_planes, kernel_size, stride=1, padding=0, dilation=1):
        super(BasicConv3dRBF, self).__init__()
        self.conv = nn.Conv3d(in_planes, out_planes,
                              kernel_size=kernel_size, stride=stride,
                              padding=padding, dilation=dilation, bias=False)
        self.bn = nn.BatchNorm3d(out_planes)
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        x = self.conv(x)
        x = self.bn(x)
        return x

class RBF_modified(nn.Module):
    def __init__(self, in_channel, out_channel):
        super(RBF_modified, self).__init__()
        self.relu = nn.ReLU(True)
        self.branch0 = nn.Sequential(
            BasicConv3dRBF(in_channel, out_channel, (1, 1, 1)),
        )
        self.branch1 = nn.Sequential(
            BasicConv3dRBF(in_channel, out_channel, (1, 1, 1)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(1, 3, 1), padding=(0, 1, 0)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(3, 1, 1), padding=(1, 0, 0)),
            BasicConv3dRBF(out_channel, out_channel, (3, 3, 3), padding=3, dilation=3)
        )
        self.branch2 = nn.Sequential(
            BasicConv3dRBF(in_channel, out_channel, (1, 1, 1)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(1, 5, 1), padding=(0, 2, 0)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(5, 1, 1), padding=(2, 0, 0)),
            BasicConv3dRBF(out_channel, out_channel, (3, 3, 3), padding=5, dilation=5)
        )
        self.branch3 = nn.Sequential(
            BasicConv3dRBF(in_channel, out_channel, (1, 1, 1)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(1, 7, 1), padding=(0, 3, 0)),
            BasicConv3dRBF(out_channel, out_channel, kernel_size=(7, 1, 1), padding=(3, 0, 0)),
            BasicConv3dRBF(out_channel, out_channel, (3, 3, 3), padding=7, dilation=7)
        )
        self.conv_cat = BasicConv3dRBF(4*out_channel, out_channel, (3, 3, 3), padding=1)
        self.conv_res = BasicConv3dRBF(in_channel, out_channel, (1, 1, 1))

    def forward(self, x):
        x0 = self.branch0(x)
        x1 = self.branch1(x)
        x2 = self.branch2(x)
        x3 = self.branch3(x)
        x_cat = self.conv_cat(T.cat((x0, x1, x2, x3), 1))

        x = self.relu(x_cat + self.conv_res(x))

        return x

class RFBMultiHeadAttn_V2(nn.Module):
    def __init__(self, in_dim, filters_head, num_multiheads):
        super(RFBMultiHeadAttn_V2, self).__init__()
        """
            Multi-head attention
            in_dim = entry dimmension
            filters_head = filters by head
            We plan to make as much attentions as possible, in order to provide a reliable
            classification. Thus, creating different types of projections called k, q and v.
        """
        self.in_dim = in_dim
        self.filters_head = filters_head
        self.num_multiheads = num_multiheads
        self.inner_filters = filters_head * num_multiheads

        #Queries of each attention made
        self.qkv_rfb = RBF_modified(in_dim, self.inner_filters * 3)

        self.rearrange_for_matmul = Rearrange(
            #"b c (d nh) h w  -> b c nh d h w", nh=num_multiheads
            "b (nh c) d h w  -> b nh c d h w", nh=num_multiheads
        )
        self.rearrange_back = Rearrange("b nh c d h w -> b (c nh) d h w")
        self.rearrange_for = Rearrange("nh b c d h w -> b (c nh) d h w")
        self.gamma_one = nn.Parameter(T.zeros(1))
        self.gamma_two = nn.Parameter(T.zeros(1))
        self.gamma_thr = nn.Parameter(T.zeros(1))
        self.gamma_fou = nn.Parameter(T.zeros(1))
        self.gamma_fiv = nn.Parameter(T.zeros(1))
        self.softmax = nn.Softmax(dim=-1)

    def forward(self, x):
        """
            inputs :
                x : input feature maps( B X C X D X W X H)
            returns :
                out : self attention value + input feature + num of heads
                attention: B X C X D X N (N is Width*Height)
        """

        #It is important to obtain a size of the input
        m_batchsize, C, dim, width, height = x.size()
#         print("x:        ", x.shape)
        #Now, we're gonna obtain an attention for each one
#         print(self.qkv_rfb(x).shape)
        proj_qkv = self.qkv_rfb(x).view(m_batchsize, -1, dim, width, height)
#         print("proj_qkv: ", proj_qkv.shape)
        proj_qkv_rearranged = self.rearrange_for_matmul(proj_qkv)
#         print("rearanfed:", proj_qkv_rearranged.shape)
        q, k, v = proj_qkv_rearranged.chunk(chunks=3, dim=2)
#         print(q.shape, k.shape, v.shape)

        sim = (k @ q.permute(0, 1, 2, 3, 5, 4))
        att_map = self.softmax(sim)  # BX (N) X (N)
        proj_v = att_map @ v
#         print("proj_v:   ", proj_v.shape)
        out_att = self.rearrange_back(proj_v)
#         print("out_att:  ", out_att.shape)
        out_heads = out_att.chunk(chunks=self.num_multiheads, dim=1)
#         print("out_heads:", out_heads[0].shape, out_heads[1].shape, out_heads[2].shape)
        out_gamma = T.cat([self.gamma_one,self.gamma_two,self.gamma_thr,self.gamma_fou,self.gamma_fiv])
        result = T.stack([(out_gamma[index] * heads + x) for index, heads in enumerate(out_heads)])
#         print("result;   ", result.shape)
        return self.rearrange_for(result)

#If you want to print inside the sequential module
class PrintLayer(nn.Module):
    def __init__(self):
        super(PrintLayer, self).__init__()

    def forward(self, x):
        # Do your print / debug stuff here
        print(x.size())
        return x

class RFBMultiHAttnNetwork_V3(nn.Module):
    def __init__(self):
        super().__init__()
        self.heads = 2
        self.RFBMHA_V3 = nn.Sequential(
            Basic3dBlock(1, 32),
            RFBMultiHeadAttn_V2(32, 32, self.heads),
            nn.BatchNorm3d(32*self.heads),
            nn.Dropout(0.1),
#             Basic3dBlock(32*self.heads, 32*self.heads),
#             RFBMultiHeadAttn_V2(32*self.heads, 32*self.heads, self.heads),
#             nn.BatchNorm3d(32*self.heads*self.heads),
#             nn.Dropout(0.1),
            nn.AdaptiveAvgPool3d((1,1,1)),
            #PrintLayer()
        )
        self.fc1 = nn.Linear(32*self.heads, 1)


    def forward(self, x):
        x = self.RFBMHA_V3(x)
        x = x.view(-1, x.size()[1])
        x = self.fc1(x)
        x = T.sigmoid(x)
        return x

"""## Preprocessing the data
But, if we want to load the PTH, we need to do certain steps, such as load the data

"""

LIDC_path = "D:\JAVERIANA\TG\Modelo\LIDC-IDRI_images_npy_3d_HU"
#LIDC_path = "/home/Data/Datasets/Pulmonary_nodules/LIDC_IDRI/LIDC-IDRI_images_npy_3d_HU"
print(len(os.listdir(LIDC_path)))
min_val = 90000
max_val = 0
for i, value in enumerate(os.listdir(LIDC_path)):
    if (value == "meta_created_info_3d.csv"): continue;
    elif(value == "meta_created_info_3d_4R.csv"): continue;
    elif(value == "meta_created_info_3d_3R.csv"): continue;
    elif(value == "meta_created_info_3d_4R_binary.csv"): continue;
    elif(value == "meta_created_info_3d_3R_binary.csv"): continue;
    elif(value == "meta_created_info_3d_1stRAD.csv"): continue;
    elif(value == "meta_created_info_3d_2ndRAD.csv"): continue;
    elif(value == "meta_created_info_3d_3rdRAD.csv"): continue;
    elif(value == "meta_created_info_3d_4thRAD.csv"): continue;
    elif(value == "meta_created_info_3d_1stRAD_all.csv"): continue;
    elif(value == "meta_created_info_3d_2ndRAD_all.csv"): continue;
    elif(value == "meta_created_info_3d_3rdRAD_all.csv"): continue;
    elif(value == "meta_created_info_3d_4thRAD_all.csv"): continue;
    elif(value == "meta_created_info_3d_1stRAD_diameter.csv"): continue;
    elif(value == "meta_created_info_3d_2ndRAD_diameter.csv"): continue;
    elif(value == "meta_created_info_3d_3rdRAD_diameter.csv"): continue;
    elif(value == "meta_created_info_3d_4thRAD_diameter.csv"): continue;


    else:
        patient_folder = os.path.join(LIDC_path,value)
        length_folder  = len(os.listdir(patient_folder))
        if (length_folder > max_val): max_val = length_folder
        if (length_folder < min_val): min_val = length_folder
        #if (length_folder == 1): print(value)
print("Max value", max_val)
print("Min value", min_val)

# df_3R = pd.read_csv(os.path.join(LIDC_path, "meta_created_info_3d_3R.csv"))
df = pd.read_csv(os.path.join(LIDC_path, "meta_created_info_3d_4R.csv"))
# df = pd.concat([df_4R])
# df_benign = df_all[df_all['malignancy']<3]
# df_malign = df_all[df_all['malignancy']>3]
# df = pd.concat([df_benign, df_malign])
df[df["malignancy"] == 3].reset_index()

df.groupby('malignancy').count()['patient_id']

def hu_normalize(im, slope, intercept):
    """normalize the image to Houndsfield Unit
    """
    im = im * slope + intercept
    im[im > 400] = 400
    im[im < -1000] = -1000

    im = (255 - 0)/(400 - (-1000)) * (im - 400) + 255

    return im.astype(np.uint8)

#Please have a try with this manner
data_transforms = transforms.Compose([
        transforms.RandomVerticalFlip(),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor()])

#datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x])

class Augmenter:
    def __init__(self, hflip=True, rotate=True, blurring=False):
        self.hflip = hflip
        self.rotate = rotate
        self.blurring = blurring

    def augment(self, x):
        im = Image.fromarray(x)
        yield im
        if self.hflip:
            yield im.transpose(Image.FLIP_LEFT_RIGHT)
        if self.rotate:
            yield im.transpose(Image.ROTATE_90)
            yield im.transpose(Image.ROTATE_180)
            yield im.transpose(Image.ROTATE_270)
        if self.blurring:
            yield im.filter(ImageFilter.GaussianBlur(1))

nodule_size = 16
X_train, X_test, y_train, y_test = train_test_split(df["folder"], df["malignancy"], test_size=0.20)
print(len(y_test), len(y_train))
num_data = len(X_train)
img_size = 32

x = T.zeros((num_data, 1, 5, img_size, img_size))
y = T.zeros((num_data, len(T.Tensor([1., 0., 0., 0.]))))


for c, row in enumerate(X_train):
    patient_folder  = os.path.join(LIDC_path,row)
    length_folder   = len(os.listdir(patient_folder))
    image_folder    = sorted(os.listdir(patient_folder))
    middle_value    = len(image_folder)//2

    if (length_folder == 1):
        tensor_image_3d = [image_folder, image_folder, image_folder, image_folder, image_folder]
        print(tensor_image_3d)
    elif (length_folder == 2):
        tensor_image_3d = [image_folder[0], image_folder[0], image_folder[1], image_folder[1], image_folder[1]]
    elif (length_folder == 3):
        tensor_image_3d = [image_folder[0], image_folder[0], image_folder[1], image_folder[2], image_folder[2]]
    elif (length_folder == 4):
        tensor_image_3d = [image_folder[0], image_folder[1], image_folder[2], image_folder[3], image_folder[3]]
    elif (length_folder >= 5):
        tensor_image_3d = [image_folder[middle_value-2], image_folder[middle_value-1], image_folder[middle_value],
                           image_folder[middle_value+1], image_folder[middle_value+2]]
    patient = df[df['folder'] == row]

    for i, value in enumerate(tensor_image_3d):

        im = np.load(os.path.join(root, patient_folder, value))
        im = im - np.min(im)
        im = ((im/np.max(im))*255).astype(np.uint8)
        width, height = im.shape; width = width//2; height = height//2
        if((im.shape[0] < 32) or (im.shape[1] < 32)): im = cv.resize(im, (32, 32))
        elif((im.shape[0] < width+nodule_size) or (im.shape[1] < width+nodule_size)): im = cv.resize(im, (32, 32))
        else: im = im[width-nodule_size:width+nodule_size, width-nodule_size:width+nodule_size]

        x[c, 0, i, :, :] = T.from_numpy(np.array(im).astype(np.float32))
        if(int(patient.malignancy) == 1): y[c, 0:] = T.Tensor([1., 0., 0., 0.])
        if(int(patient.malignancy) == 2): y[c, 0:] = T.Tensor([0., 1., 0., 0.])
        if(int(patient.malignancy) == 4): y[c, 0:] = T.Tensor([0., 0., 1., 0.])
        if(int(patient.malignancy) == 5): y[c, 0:] = T.Tensor([0., 0., 0., 1.])

print("x: ",x.shape)
print("y: ",y.shape)
# D:\JAVERIANA\TG\Modelo\Multi-attention-nodule-classification\Journal_SPIE_binary_Ind_Inferences/LIDC-IDRI_images_npy_3d_HU/LICD-0099_NI002

path = "D:\JAVERIANA\TG\Modelo\LIDC-IDRI_images_npy_3d_HU\LICD-0099_NI002"
os.listdir(path)

print("          Train          ")
print("1", list(y_train).count(1))
print("2", list(y_train).count(2))
print("3", list(y_train).count(3))
print("4", list(y_train).count(4))
print("5", list(y_train).count(5))

print("          Test          ")
print("1", list(y_test).count(1))
print("2", list(y_test).count(2))
print("3", list(y_test).count(3))
print("4", list(y_test).count(4))
print("5", list(y_test).count(5))

"""## Focal loss"""

#It says it is multiclass
class FocalLoss(nn.modules.loss._WeightedLoss):
    def __init__(self, weight=None, gamma=5,reduction='mean'):
        super(FocalLoss, self).__init__(weight,reduction=reduction)
        self.gamma = gamma
        self.weight = weight #weight parameter will act as the alpha parameter to balance class weights

    def forward(self, input, target):

        ce_loss = F.cross_entropy(input, target,reduction=self.reduction,weight=self.weight)
        pt = T.exp(-ce_loss)
        focal_loss = ((1 - pt) ** self.gamma * ce_loss).mean()
        return focal_loss

"""## Transfer learning
Create each validate and train function
"""

img_size = 32; nodule_size = 16
def get_dataset(LIDC_path):
    df_all = pd.read_csv(os.path.join(LIDC_path, "meta_created_info_3d_4R.csv"))
    df = df_all[df_all['malignancy'] != 3]

    num_data = len(df["folder"])
    x = T.zeros((num_data, 1, 5, img_size, img_size))
    y = T.zeros((num_data, 1))

    for c, row in enumerate(df["folder"]):
        patient_folder  = os.path.join(LIDC_path,row)
        print('patient folder:' + patient_folder)
        length_folder   = len(os.listdir(patient_folder))
        image_folder    = sorted(os.listdir(patient_folder))
        middle_value    = len(image_folder)//2

        if (length_folder == 1):
            tensor_image_3d = [image_folder, image_folder, image_folder, image_folder, image_folder]
        elif (length_folder == 2):
            tensor_image_3d = [image_folder[0], image_folder[0], image_folder[1], image_folder[1], image_folder[1]]
        elif (length_folder == 3):
            tensor_image_3d = [image_folder[0], image_folder[0], image_folder[1], image_folder[2], image_folder[2]]
        elif (length_folder == 4):
            tensor_image_3d = [image_folder[0], image_folder[1], image_folder[2], image_folder[3], image_folder[3]]
        elif (length_folder >= 5):
            tensor_image_3d = [image_folder[middle_value-2], image_folder[middle_value-1], image_folder[middle_value],
                               image_folder[middle_value+1], image_folder[middle_value+2]]
        patient = df[df['folder'] == row]
        for i, value in enumerate(tensor_image_3d):
            
            im = np.load(os.path.join(root, patient_folder, value))
            im = im - np.min(im)
            im = ((im/np.max(im))*255).astype(np.uint8)
            width, height = im.shape; width = width//2; height = height//2
            if((im.shape[0] < 32) or (im.shape[1] < 32)): im = cv.resize(im, (32, 32))
            elif((im.shape[0] < width+nodule_size) or (im.shape[1] < width+nodule_size)): im = cv.resize(im, (32, 32))
            else: im = im[width-nodule_size:width+nodule_size, width-nodule_size:width+nodule_size]

#             print(patient.malignancy)
            x[c, 0, i, :, :] = T.from_numpy(np.array(im).astype(np.float32))
            if(int(patient.malignancy) == 1): y[c, 0:] = 0
            if(int(patient.malignancy) == 2): y[c, 0:] = 1
            if(int(patient.malignancy) == 3): y[c, 0:] = 2
            if(int(patient.malignancy) == 4): y[c, 0:] = 3
            if(int(patient.malignancy) == 5): y[c, 0:] = 4

    mu = x.mean()
    sd = x.std()
    x = (x - mu) / sd
    testset = TensorDataset(x, y)

    return testset

from sklearn.preprocessing import OneHotEncoder
class Trainer:
    def __init__(self, training_set, validation_set,batch_size, n_epochs, model, optimizer, loss, name, device='cuda',
                 deterministic=False, parallel=False):

        T.backends.cudnn.deterministic = deterministic
        self.batch_size = batch_size
        self.dataset = training_set
        self.valid_dataset = validation_set

        self.model = model
        self.device = device
        self.parallel = parallel
        if parallel:
            self.model = nn.DataParallel(model)
        self.model.cuda(self.device)
        self.optimizer = optimizer
        self.loss = loss
        self.n_epochs = n_epochs
        self.name = name
        self.log = ''


    def train_epoch(self, epoch):
        s_time = time.time()
        self.model.train()
        all_losses = []
        all_acc = []
        for data, target in self.dataset:
            data, target = data.cuda(self.device), target.cuda(self.device)
            self.optimizer.zero_grad()
            output = self.model(data)
            acc = self.calc_accuracy(output, target)
            #Si se usa la V2, se necesita realizar un .mean()
            loss = self.loss(output, target)
            loss.backward()
            self.optimizer.step()
            all_losses.append(loss.item())
            all_acc.append(acc.cpu())

        valid_acc = self.validate()
        self.report(all_losses, all_acc, valid_acc, epoch, time.time() - s_time)

    def report(self, all_losses, all_acc, valid_acc, epoch, duration):
        n_train = len(all_losses)
        loss = np.sum(all_losses) / n_train

        def summery(data):
            n = 0.0
            s_dist = 0
            for dist in data:
                s_dist += T.sum(dist)
                n += len(dist)

            return s_dist.float() / n

        tr_dist = summery(all_acc)
        va_dist = summery(valid_acc)


        dataset_valid, target, pred = self.predict()
        fpr, tpr, thresholds = metrics.roc_curve(target, pred)
        auc = metrics.auc(fpr, tpr)

        msg = f'epoch {epoch}: loss {loss:.3f} Tr Acc {tr_dist:.2f} Val Acc {va_dist:.2f} AUC {auc:.2f} duration {duration:.2f}'
        print(msg)
        self.log += msg + '\n'


    def predict(self):
        self.model.eval()
        all_pred = T.zeros(len(self.valid_dataset.dataset))
        all_targets = T.zeros(len(self.valid_dataset.dataset)); all_dataset = [];
        for batch_idx, (data, target) in enumerate(self.valid_dataset):
            with T.no_grad():
                data, target = data.cuda(self.device), target.cuda(self.device)
                output = self.model(data)

            st = batch_idx * self.batch_size
            all_dataset.append(data)
            all_pred[st:st + output.shape[0]] = output.cpu().squeeze()
            all_targets[st:st + target.shape[0]] = target.cpu().squeeze()

        return all_dataset, all_targets, all_pred


    def validate(self):
        dataset_valid, targets_append, pred_append = self.predict()
        matches = self.calc_accuracy(pred_append, targets_append)
        return [matches]

    def calc_accuracy(self, x, y):
        x_th = (x > 0.5).long()
        matches = x_th == y.long()
        return matches

    def run(self):
        start_t = time.time()
        for epoch in range(self.n_epochs):
            self.train_epoch(epoch)
        diff = time.time() - start_t
        print(f'took {diff} seconds')
        with open(os.path.join('results',f'{self.name}.txt'),'w') as f:
            f.write(self.log)
        print(f'took {diff} seconds')

def get_metrics(target, pred):
    prec, recall, _, _ = metrics.precision_recall_fscore_support(target, pred>0.5, average='binary')
    fpr, tpr, thresholds = metrics.roc_curve(target, pred)
    auc = metrics.auc(fpr, tpr)
    conf_mat = 0
    return prec, recall, auc, conf_mat

def calc_accuracy(x, y):
    x_th = (x > 0.5).long()
    matches = x_th == y.long()
    return matches

def reset_rand():
    seed = 1000
    T.manual_seed(seed)
    T.cuda.manual_seed(seed)
    np.random.seed(seed)
    random.seed(seed)

embedding_layer = {}
def get_activation(name):
    def hook(model, input, output):
        embedding_layer[name] = output.detach()
    return hook
def kfold(src_path, batch_size, name, device, deterministic=False, dataset_func=get_dataset):
    print(f'Experiment {name}')
    prediction_ = []; class_ = [];
#     for fold in range(10):
    fold = 8
    print(f'------------ fold {fold+1} ------------')
    testset = dataset_func(os.path.join(src_path))
    print(f'Validation Size: {len(testset)}')
    testset = DataLoader(testset, batch_size, shuffle=False)

    multi_head_attn = RFBMultiHAttnNetwork_V3()
    multi_head_attn.to(device)
    print(fold_weight_path + "_fold_" + str(fold) + ".pth")
    multi_head_attn.load_state_dict(T.load(fold_weight_path + "_fold_" + str(fold) + ".pth", map_location=T.device(device)))

    #Test epoch
    multi_head_attn.eval()
    for batch_idx, (data, target) in enumerate(testset):
        with T.no_grad():
            data, target = data.to(device), target.to(device)
            print(type(data))
            print(data.shape)
            print(len(data))
            output = multi_head_attn(data)# torch.nan_to_num()
            #print("output", output.shape)
            prediction_.append(T.nan_to_num(output.cpu()))
            class_.append(target.cpu())

    return prediction_, class_

# Microservicio de Flask

def create_csv(frames, folder, output_path):
    filename = "meta_created_info_3d_4R"
    columns = [
        "patient_id",
        "nodule_no",
        "folder",
        "malignancy",
        "is_cancer",
        "calcification",
        "lobulation",
        "texture",
        "spiculation",
        "subtlety",
        "margin",
        "intercept",
        "slope"
    ]

    csv_filename = f"{filename}.csv"

    if output_path:
        csv_filename = os.path.join(output_path, csv_filename)

    with open(csv_filename, mode="w", newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=columns)

        writer.writeheader()

        for nodule_no in range(0, frames):
            row_data = {
                "patient_id": 1012,
                "nodule_no": nodule_no,
                "folder": folder,  # Utiliza el valor de `folder` sin el número de nódulo
                "malignancy": 4,
                "is_cancer": True,
                "calcification": 6,
                "lobulation": 3,
                "texture": 5,
                "spiculation": 2,
                "subtlety": 5,
                "margin": 4,
                "intercept": -1024.0,
                "slope": 1.0
            }
            writer.writerow(row_data)

    print(f"Archivo CSV '{csv_filename}' creado con éxito.")

def save_npy(output_path, filename, frame, data):
    output_path += "/" + filename 
    filename += "_" + str(frame) + ".npy"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    path = os.path.join(output_path, filename)
    np.save(path, data)

app = Flask(__name__)

@app.route('/nodule-classification')
def noduleclassification():
    try:
        data = request.get_json()

        if 'filename' not in data:
            return jsonify({'error': 'El campo "filename" es obligatorio.'}), 400

        if 'data' not in data or not isinstance(data['data'], list):
            return jsonify({'error': 'El campo "data" debe ser una lista.'}), 400

        #shape = np.array(data['data']).shape
        #if len(shape) != 3 or shape[0] != 32 or shape[1] != 32:
            #return jsonify({'error': 'El arreglo debe ser de 32x32x(cualquier dimensión).'}), 400

        numpy_array = np.array(data['data'])
        filename = data['filename']

        LIDC_path_test = "D:\JAVERIANA\TG\Modelo\LIDC-IDRI_images_npy_3d_HU_TEST"
        
        create_csv(len(numpy_array), filename, LIDC_path_test)
        print(len(numpy_array))
        for frame in 0, len(numpy_array) - 1:
            print(numpy_array)
            save_npy(LIDC_path_test, filename, frame, numpy_array[frame])
        
        prediction_, class_ =  kfold(LIDC_path_test,
                                    376,
                                    name='binary_Indeterminate_values',
                                    device='cpu',
                                    deterministic=True,
                                    dataset_func=get_dataset)

        return str(list(prediction_[0]))
    except Exception as e:
        traceback_str = traceback.format_exc()
        # Devuelve el error junto con el número de línea
        return jsonify({'error': str(e), 'traceback': traceback_str}), 500

if __name__ == '__main__':
    app.run(port=4250)

#np.save("Prediction_binary_indeterminate.npy", prediction_[0])

#T.max(prediction_[0], axis=1)

#for i, volumen in enumerate(x):
    #print(volumen.shape, y[i])
    #plt.imshow(volumen.permute(1,2,3,0)[0], cmap = "gray")