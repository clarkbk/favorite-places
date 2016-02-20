import os

from flask import Flask
from flask import render_template


rel_path = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
            template_folder=os.path.join(rel_path, 'templates'),
            static_folder=os.path.join(rel_path, 'static'))

CONFIG = {
    'MAPBOX_ACCESS_TOKEN': os.environ['MAPBOX_ACCESS_TOKEN'],
    'GEOJSON_LOCATION': os.environ['GEOJSON_LOCATION']
}


@app.route('/map')
def index():
    return render_template('map.html', config=CONFIG)

if __name__ == '__main__':
    app.run()
