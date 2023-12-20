from flask import Flask, request, jsonify, render_template, url_for
from SamModel import predictRes

app = Flask("TechnoLab-Chatbot")


@app.route('/get-response', methods=['POST'])
def predict():
    user_input = request.json['message']
    response = predictRes(user_input)
    return jsonify(response)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
