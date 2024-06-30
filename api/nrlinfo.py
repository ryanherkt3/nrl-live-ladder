import requests

from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Make nrl.com think I am not a bot
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
}

@app.route('/api/nrlinfo', methods=['GET'])
def nrl_info():
    test = {
        "draw": requests.get("https://www.nrl.com/draw/data", headers=headers).json(),
        "ladder": requests.get("https://www.nrl.com/ladder/data", headers=headers).json()
    }

    return test

if __name__ == '__main__':
    app.run(debug=True, port=8080)
