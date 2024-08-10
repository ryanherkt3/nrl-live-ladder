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

    for i in range(1, 28, 1):
        apiUrl = f"https://www.nrl.com/draw/data?competition=111&round={i}"
        rounds.update(
            {i: requests.get(apiUrl, headers=headers).json()}
        )

    return rounds

# TODO deprecate (?) (can use above call to get team's next opponent)
# i.e. for a team pass next round isBye, round url (if it exists) and team nickname
@app.route('/api/nextround', methods=['GET'])
def next_round():
    teamId = request.args.get('teamid')

    apiUrl = f"https://www.nrl.com/draw/data?competition=111&team={teamId}"

    return requests.get(apiUrl, headers=headers).json()

if __name__ == '__main__':
    app.run(debug=True, port=8080)
