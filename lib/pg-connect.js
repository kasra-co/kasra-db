'use strict';

var _ = require( 'lodash');
var url = require( 'url');
var pg = null;

try {
	pg = require('pg').native;
}
catch(e) {
	pg = require( 'pg');
}

_.str = require('underscore.string');
_.mixin(_.str.exports());

function PGConnect(test,config) {

	var dbKey = test ? 'db_test' : 'db';
	var cfg = config.pgsql;
	var dbName = cfg.connection[dbKey];
	this.config = _.extend(_.omit(cfg.connection,['db','db_test']),
		{query: cfg.settings},
		{pathname: dbName, protocol: 'postgres', slashes: true});
	this.connection = null;
}


PGConnect.prototype.connect = function connect(callback) {

	var that = this;

	pg.connect(url.format(this.config), function(err, client, done) {
		if(err) {
			callback(err,null);
		} else {
			that.connection = client;
			that.done = done;
			callback(null,that);
		}

	});

};

PGConnect.prototype.end = function end(callback) {

	this.connection.end();

};

module.exports = function(test,config) {
	return new PGConnect(test,config);
};
