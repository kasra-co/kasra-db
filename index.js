'use strict';

module.exports = {
	init: function(options,appConfig,callback) {

		var connection = null;
		var allowedDBs = ['mongo','pg','memcached'];

		if(allowedDBs.indexOf(options.db.type) === -1) {
			return callback(['Invalid db: '+options.db.type]);
		}

		connection = require( './lib/'+options.db.type+'-connect' )(options.db.testdb,appConfig)
		.connect(function(err,dbconn) {

			if(err) {
				return callback(['Could not connect to %s %s',options.db.type,err]);
			}

			callback(null,dbconn);

		});
	}
};







