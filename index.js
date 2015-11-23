'use strict';

var url = require('url');
var async = require('async');

module.exports = {
	init: function(options,appConfig,callback) {

		var connection = null;
		var allowedDBs = ['mongo','pg','memcached','redis','beanstalkd'];
		var connections = {};

		async.eachSeries(options.db, function(db,cb) {

			if(allowedDBs.indexOf(db.type) === -1) {
				return cb(['Invalid db: '+db.type]);
			}

			connection = require( './lib/'+db.type+'-connect' )(db.testdb,appConfig,options.logger)
			.connect(function(err,dbconn,dbinfo) {

				if(err) {
					return callback(['Could not connect to %s %s',db.type,err]);
				}

				connections[db.type] = {connection: dbconn, connstr: url.format(dbinfo)};

				if(!dbconn.connection.reconnected) {
					cb(null);
				}

			});

		}, function(err) {
			if(err) {
				callback(err);
			} else {
				callback(null,connections);
			}

		});

	}
};
