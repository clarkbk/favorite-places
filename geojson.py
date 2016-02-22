import csv
import json
import os
import requests

from boto.s3.key import Key
from boto.s3.connection import S3Connection

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
CSV_LOCATION = os.environ['CSV_LOCATION']


def get_csv(headers):
    url = CSV_LOCATION
    r = requests.get(url)
    reader = csv.DictReader(r.text.splitlines(), headers)
    return reader


def geojson_from_csv(csv_reader, order):
    geojson = {
        'restaurants': {
            'type': 'FeatureCollection',
            'features': []
        },
        'food': {
            'type': 'FeatureCollection',
            'features': []
        },
        'shopping': {
            'type': 'FeatureCollection',
            'features': []
        },
        'hotelstravel': {
            'type': 'FeatureCollection',
            'features': []
        },
        'arts': {
            'type': 'FeatureCollection',
            'features': []
        },
    }
    csv_reader.next()
    for row in csv_reader:
        lat = float(row.pop('lat'))
        lon = float(row.pop('lon'))
        category = row['parent_category']
        feature = {
            'type': 'Feature',
            'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
            'properties': row
        }
        geojson[category]['features'].append(feature)
    return geojson


def write_geojson(geojson, filename):
    with open(filename, 'w') as f:
        f.write('{fn}({data})'.format(**{
            'fn': 'callback',
            'data': json.dumps(geojson)
        }))


def put_on_s3(filename):
    conn = S3Connection(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    bucket = 'favorite-places'
    k = Key(conn.get_bucket(bucket))
    k.key = os.path.join('nyc', filename)
    k.set_contents_from_filename(filename)
    return 'https://s3.amazonaws.com/{bucket}/{key}'.format(**{
        'bucket': bucket,
        'key': k.key
    })


def update_geojson():
    filename = 'favorite-places.jsonp'
    headers = [
        'name',
        'parent_category',
        'categories',
        'address',
        'cross_streets',
        'neigborhoods',
        'lat',
        'lon',
        'review_count',
        'rating',
        'url'
    ]
    reader = get_csv(headers)
    geojson = geojson_from_csv(reader, headers)
    write_geojson(geojson, filename)
    put_on_s3(filename)

if __name__ == '__main__':
    update_geojson()
