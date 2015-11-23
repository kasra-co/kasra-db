'use strict';

var Beanstalkd = require('fivebeans');

function BeanstalkdConnect(test,config,logger) {

	this.config = config.beanstalkd;
	this.logger = logger;
	this.connection = null;
}

BeanstalkdConnect.prototype.connect = function connect(callback) {

		var that = this;

		var client = new Beanstalkd.client(this.config.host, this.config.port);

		client
		.on('error', function (err) {
			that.logger.error(err.message);
		})
		.on('connect', function () {
			that.connection = client;
			if(client.connected) {
				callback(null,that,{
					hostname: that.config.host,
					port: that.config.port,
					protocol: 'beanstalkd',
					slashes: true
				});
			}
		})
		.on('close', function (err) {
			that.end();
			that.logger.error('Beanstalkd connection lost.');
		}).
		on('reconnecting',function(interval) {
			that.logger.info('Reconnecting Beanstalkd in ',interval,'ms');
    	}).
    	on('reconnected',function() {
    		that.logger.info('Reconnected to Beanstalkd');
    	}).connect();

};

BeanstalkdConnect.prototype.end = function end(callback) {
	this.connection.quit();
};

module.exports = function(test,config,logger) {
	return new BeanstalkdConnect(test,config,logger);
};
