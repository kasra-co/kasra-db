'use strict';

var Beanstalkd = require('fivebeans');
//var _ = require( 'lodash');

function BeanstalkdConnect(test,config) {

	this.config = config.beanstalkd;
	this.connection = null;
}

BeanstalkdConnect.prototype.connect = function connect(callback) {

		var that = this;

		var client = new Beanstalkd.client(this.config.host, this.config.port);

		client
		.on('error', function (err) {
			callback(err,null);
		})
		.on('connect', function () {
			that.connection = client;
			callback(null,that,{
				hostname: that.config.host,
				port: that.config.port,
				protocol: 'beanstalkd',
				slashes: true
			});
		})
		.on('close', function () {
			that.end();
		}).connect();

};

BeanstalkdConnect.prototype.end = function end(callback) {
	this.connection.quit();
};

module.exports = function(test,config) {
	return new BeanstalkdConnect(test,config);
};
