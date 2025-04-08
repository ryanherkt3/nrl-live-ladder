# TODO move to draw-fetcher.tsx (i.e. deprecate serverless function)

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

    comp = request.args.get('comp')
    compRounds = int(request.args.get('rounds'))

    for i in range(1, compRounds, 1):
        apiUrl = f"https://www.nrl.com/draw/data?competition={comp}&round={i}"
        rounds.update(
            {i: requests.get(apiUrl, headers=headers).json()}
        )

    return rounds