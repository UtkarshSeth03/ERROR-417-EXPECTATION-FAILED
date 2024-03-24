import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from flask import Flask, request
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
cors = CORS(app)

model = AutoModelForSequenceClassification.from_pretrained("utkarshseth/roberta-base-depression-fine-tuned", num_labels = 2)
model.config.use_cache = True
model.eval()

tokenizer = AutoTokenizer.from_pretrained("roberta-base")

questions = pd.read_csv(r"C:\Users\utkar\OneDrive\Desktop\SEM6\Dotslash\project\backend\questions.csv")

replies = ""

@app.route("/storeReply", methods = ["POST"])
@cross_origin()
def storeReply():
    global replies
    data = request.json
    reply = data["reply"]
    # replies.append(reply)
    replies += " " + reply
    print(replies.strip())
    inputs = tokenizer([reply.strip()], return_tensors = "pt")
    outputs = model(**inputs)
    values = outputs["logits"]
    softmax = nn.Softmax(dim = 1)
    probabilities = softmax(values)
    probabilities = list(probabilities[0].detach().numpy())
    if probabilities[0] < probabilities[1]:
        question = random.choice(list(questions[questions["label"] == "depressed"]["Response"]))
    else:
        question = random.choice(list(questions[questions["label"] == "happy"]["Response"]))
    return {
        "botReply": question
    }

@app.route("/getResult", methods = ["GET"])
@cross_origin()
def getResult():
    # predictions = []
    # for i in replies:
    #     inputs = tokenizer([i], return_tensors="pt")
    #     outputs = model(**inputs)
    #     values = outputs["logits"]
    #     softmax = nn.Softmax(dim = 1)
    #     probabilities = softmax(values)
    #     probabilities = list(probabilities[0].detach().numpy())
    #     print(probabilities)
    #     if probabilities[0] < probabilities[1]:
    #         predictions.append(True)
    #     else:
    #         predictions.append(False)
    # trueCounts = predictions.count(True)
    # falseCounts = len(predictions) - trueCounts
    # if trueCounts > 0.6 * len(predictions):
    #     return {
    #         "label": True
    #     }
    # else:
    #     return {
    #         "label": False
    #     }
    global replies
    inputs = tokenizer([replies.strip()], return_tensors = "pt")
    outputs = model(**inputs)
    values = outputs["logits"]
    softmax = nn.Softmax(dim = 1)
    probabilities = softmax(values)
    probabilities = list(probabilities[0].detach().numpy())
    print(probabilities)
    replies = ""
    # if probabilities[0] < probabilities[1]:
    #     return {
    #         "label": True
    #     }
    # else:
    #     return {
    #         "label": False
    #     }
    return [
        round(float(probabilities[0]) * 100, 2),
        round(float(probabilities[1]) * 100, 2)
    ]


if __name__ == "__main__":
    app.run(debug = True, port = 8080)