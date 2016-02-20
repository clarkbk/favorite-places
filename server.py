import os

from flask import Flask
from flask import send_from_directory

app = Flask(__name__)


@app.route('/map')
def index():
    rel_path = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(os.path.join(rel_path, 'static'), 'map.html')

if __name__ == '__main__':
    app.run()
