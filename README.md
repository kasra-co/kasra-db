# Category Service

This service provides data and queries for taxonomies. Right now only categories are implemented.

## Getting started

You need to intsall PostgresSQL. This can be installed in many ways, see the following page:

http://www.postgresql.org/docs/9.4/static/tutorial-install.html

Under MacOS X, the easiest way to set up everything is this app:

http://postgresapp.com/

Simply download and start it. That's it.

If you installed the above app, you need to update your path. Add the following line to ~/.profile or
~/.bashrc

```
export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/9.4/bin
```

If you used .profile, run source:

```
source ~/.profile
```

Once PSQL is running, start up the psql client (shell) and create the database:

```
psql
create database kasra2
\q
```

Now, clone this project:

```
mkdir ~/categoryservice
git clone https://github.com/menaPOST/category-service.git ~/categoryservice
cd ~/categoryservice
npm install

```

Finally, load the db data:

```
psql kasra2 < ~/categoryservice/data/dump.sql
```


## Configure the service

Create local config file:

```
cp config/example.js config/index.js
```

You can edit index.js to adjust some settings. The DB settings under "pgsql" key probably should be modified.

###Change The Port Number

You should edit this only if the default port (3002) is alerady in use.

	service: {
		port: xxxx,
	}

**Do not use the same port as the Kasra App.** 

Options may be passed to the logger too, but this should be necessary only in production. You might want to modify
the log directory though, see "logging -> dir". 

## Run the service

Run this:

```
node service.js --logging 1
```

This will log errors and warnings to the console. Omit the logging option if you want to suppress logging.

You can also run:

```
gulp watch
```


# API

## Common stuff

Calling any endpoint requires the HTTP header "Accept" to be "application/json". Any other type of request will result in 400 errors.

All API methods return:

-  500 on fatal or internal errors.
-  404 on calling non-existent endpoints or using an inappropriate HTTP method with an existing endpoint.

All responses are returned as JSON.

Some endpoints that accept a path parameter support lqueries. See the following page for examples:

http://www.postgresql.org/docs/9.4/static/ltree.html

## Methods

### GET /categories

Returns a tree of all categories as JSON object. 

### GET /categories/descendants/[some_path]

Returns descendants of the given path as a tree (JSON object) or 404, if the path doesn't exist.

### GET /categories/ancestors/[some_path]

Returns ancestors of the given path as a tree (JSON object) or 404, if the path doesn't exist.

### GET /categories/query/[some_path]

Performs an lquery and resturns all matching paths as JSON object.





