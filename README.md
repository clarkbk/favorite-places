A web server, serving a single-page map of Ben & Janice's favorite places.

## Setup

In terminal:

```bash
$ touch .env
```

In .env:

```bash
export AWS_ACCESS_KEY_ID=…
export AWS_SECRET_ACCESS_KEY=…
export CSV_LOCATION=…
export GEOJSON_LOCATION=…
export MAPBOX_ACCESS_TOKEN=…
```

Back to terminal:

```bash
$ mkvirtualenv favorite-places
$ pip install -r requirements.txt
$ source .env
```

## Use

In terminal:

```bash
$ workon favorite-places
$ python server.py
```

Launch `http://localhost:5000/nyc` in your browser.

## Deployment

In terminal:

```bash
$ heroku login
$ git push heroku master
```

(Related Heroku project: `evening-springs-86790`)
