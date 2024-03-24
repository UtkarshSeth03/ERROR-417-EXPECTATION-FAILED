from tensorflow.keras.models import model_from_json
from keras.models import load_model
import json

json_file = open(r"C:\Users\utkar\OneDrive\Desktop\SEM6\Dotslash\project\backend\emotiondetector.json", "r")
model_json = json_file.read()

loaded_model = model_from_json(model_json)
loaded_model.load_weights(r"C:\Users\utkar\OneDrive\Desktop\SEM6\Dotslash\project\backend\emotiondetector.h5")

loaded_model.compile(loss = 'binary_crossentropy', metrics=['accuracy'])