from tensorflow.keras.models import model_from_json
from keras.models import load_model
from keras.utils import load_img
from PIL import Image
import numpy as np
import tensorflow as tf
import json

json_file = open(r"C:\Users\Dell\Documents\Dotslash\emotiondetectorf.json", "r")
model_json = json_file.read()
json_file.close()

loaded_model = model_from_json(model_json)
loaded_model.load_weights(r"C:\Users\Dell\Documents\Dotslash\emotiondetectorf.h5")

def ef(image):
    img = load_img(image, color_mode='grayscale')
    feature = np.array(img)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0
image = r"C:\Users\Dell\Documents\Dotslash\archive\archive\images\images\train\angry\15763.jpg"
img = ef(image)
pred = loaded_model.predict(img)
label = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
pred_label = label[pred.argmax()]
print("model prediction is ", pred_label)
