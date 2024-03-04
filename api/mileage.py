from flask import Flask, request, jsonify

app = Flask(__name__)

def predict_mileage(cc, mileage, weight):

    mileage_prediction = cc * 0.01 + mileage * 0.5 - weight * 0.1
    return mileage_prediction

@app.route('/predict_mileage', methods=['POST'])
def predict():
    data = request.get_json()
    cc = data['cc']
    mileage = data['mileage']
    weight = data['weight']
    mileage_prediction = predict_mileage(cc, mileage, weight)
    return jsonify({'mileage_prediction': mileage_prediction})

if __name__ == '__main__':
    app.run(debug=True)