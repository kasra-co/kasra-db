'use strict';

var redis = require('redis');
//var _ = require( 'lodash');

function RedisConnect(test,config) {

	this.config = config.redis;
	this.connection = null;
}

RedisConnect.prototype.connect = function connect(callback) {

		var that = this,
    	client = {};

    	client = redis.createClient(this.config.port,this.config.host,this.config.options);

		client.on('error', function (err) {
			callback(err,null);
		});

		client.on('connect', function (err) {
			function set_connection(err,cb) {
				if(err) {
					return cb(err,null);
				} else {
					that.connection = client;
				}
				return cb(null,that,{
					hostname: that.config.host,
					port: that.config.port,
					protocol: 'redis',
					slashes: true
				});
			}
			if(that.config.db) {
				client.select(that.config.db, function(err) {
					set_connection(err,callback);
				});
			} else {
				set_connection(null,callback);
			}
		});

};

RedisConnect.prototype.end = function end(callback) {
	this.connection.quit();
};

module.exports = function(test,config) {
	return new RedisConnect(test,config);
};
