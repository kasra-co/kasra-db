'use strict';

var MongoClient = require('mongodb').MongoClient;
var _ = require( 'lodash');
var url = require( 'url');

_.str = require('underscore.string');
_.mixin(_.str.exports());

function MongoConnect(test,config) {

	var dbKey = test ? 'db_test' : 'db';
	var dbName = config.mongodb[dbKey];
	this.config = _.extend(_.omit(config.mongodb,['db','db_test']),
		{query: config.mongoserver},
		{pathname: dbName, protocol: 'mongodb', slashes: true});
	this.connection = null;
}

MongoConnect.prototype.connect = function connect(callback) {

		var that = this;

		MongoClient.connect(url.format(this.config), function(err, mongodb) {

			if(err) {
				callback(err,null);
			} else {
				that.connection = mongodb;
				callback(null,that);
			}
		});
};

MongoConnect.prototype.end = function end(callback) {
	this.connection.close();
};

module.exports = function(test,config) {
	return new MongoConnect(test,config);
};
