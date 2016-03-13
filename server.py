import json
import os

from flask import Flask
from flask import render_template
from flask import request
from geojson import update_geojson


rel_path = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
            template_folder=os.path.join(rel_path, 'templates'),
            static_folder=os.path.join(rel_path, 'static'))

CONFIG = {
    'MAPBOX_ACCESS_TOKEN': os.environ['MAPBOX_ACCESS_TOKEN'],
    'GEOJSON_LOCATION': os.environ['GEOJSON_LOCATION']
}


@app.route('/nyc')
def index():
    options = {}
    for param, value in request.args.items():
        if param in ['z', 'embed']:
            options[param] = request.args.get(param)
    return render_template('map.html', config=CONFIG, options=options)


@app.route('/update', methods=['POST'])
def update():
    try:
        update_geojson()
        return (
            json.dumps({'success': True}),
            200,
            {'ContentType': 'application/json'})
    except Exception as e:
        return (
            'Error: {0}'.format(e),
            500,
            {'ContentType': 'application/json'}
        )


if __name__ == '__main__':
    app.run()
