'use strict';

var Memcached = require('memcached');
var _ = require( 'lodash');

function MemcachedConnect(test,config) {

	this.config = _.omit(config.memcached,'stores');
	this.connection = null;
}

MemcachedConnect.prototype.connect = function connect(callback) {

		var that = this;

		var memcached = new Memcached(this.config.hosts,this.config.options);

		memcached.connect( this.config.hosts[0], function( err, conn ){
		  if( err ) {
		  	callback(err,null);
		  } else {
		  	that.connection = memcached;
		  	callback(null,that);
		  }
		});
};

MemcachedConnect.prototype.end = function end(callback) {
	this.connection.end();
};

module.exports = function(test,config) {
	return new MemcachedConnect(test,config);
};
