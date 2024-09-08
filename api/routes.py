import requests

from flask import Flask
from flask import request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Make nrl.com think I am not a bot
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
}

@app.route('/api/seasondraw', methods=['GET'])
def season_draw():
    rounds = {}

    # 32 = 27 rounds plus 4 weeks of finals 
    for i in range(1, 32, 1):
        apiUrl = f"https://www.nrl.com/draw/data?competition=111&round={i}"
        rounds.update(
            {i: requests.get(apiUrl, headers=headers).json()}
        )

    return rounds