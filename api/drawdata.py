import requests

from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/api/drawdata', methods=['GET'])
def get_outages():
    return requests.get("https://www.nrl.com/draw//data").json()

if __name__ == '__main__':
    app.run(debug=True, port=8080)
