'use strict';

var _ = require( 'lodash');
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

	var cfg = config.pgsql;
	this.config = _.extend(cfg.connection,{query: cfg.settings});
	this.connection = null;
}


PGConnect.prototype.connect = function connect(callback) {

	var that = this;

	pg.connect(this.config, function(err, client, done) {
		if(err) {
			callback(err,null);
		} else {
			that.connection = client;
			that.done = done;
			callback(null,that,that.config);
		}

	});

};

PGConnect.prototype.end = function end(callback) {

	this.connection.end();

};

module.exports = function(test,config) {
	return new PGConnect(test,config);
};
