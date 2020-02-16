from flask import Flask, request
import fastai.vision as fastai
app = Flask(__name__)

CLASSIFIER = fastai.load_learner("../models", "classifier.pkl")
REGRESSION = fastai.load_learner("../models", "regression.pkl")

@app.route("/classify", methods=["POST", "OPTIONS"])
def classify():
  files = request.files
  image = fastai.image.open_image(files['image'])
  prediction = CLASSIFIER.predict(image)
  price_prediction = REGRESSION.predict(image)
  return {
    "pricePrediction": round(float(price_prediction[1]), 2),
    "brandPredictions": sorted(
      list(
        zip(
          CLASSIFIER.data.classes,
          [round(x,4) for x in map(float, prediction[2])]
        )
      ),
      key=lambda p: p[1],
      reverse=True
    )
  }

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8000, debug=True)
