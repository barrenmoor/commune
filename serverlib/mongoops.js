exports.MongoOp = function() {
	var MongoClient = require('mongodb').MongoClient;
	var Server = require('mongodb').Server;
	var assert = require('assert');

	var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});

	var DATABASE = "mydb";

	var _call_error_callback = function(err, errorCallback, mongoclient) {
		if(null != err) {
			mongoclient.close();

			if(errorCallback) {
				errorCallback(err);
			}
			return -1;
		}
		return 0;
	};

	var _mongoOp = function(op, data, error) {
		mongoclient.open(function(err, mongoclient) {
			var db = mongoclient.db(DATABASE);
			db.collection('sprints', function(err, collection) {
				if(_call_error_callback(err, error, mongoclient) == -1) {
					return;
				}
				op(mongoclient, collection, data);
			});
		});
	};

	return {
		_mongo_addSprint : function(config) {
			_mongoOp(function(mongoclient, collection, data) {
				if(!data || !data.sprint) {
					_call_error_callback({reason : 'no data!'}, config.error, mongoclient);
					return;
				}

				collection.insert(data.sprint, function(err, result) {
					if(_call_error_callback(err, config.error, mongoclient) == -1) {
						return;
					} else {
						mongoclient.close();
						if(config.success) {
							config.success({result : result.length});
						}
					}					
				});
			}, config.data, config.error);
		},

		_mongo_getSprints : function(config) {
			_mongoOp(function(mongoclient, collection, data) {
				collection.find(data ? data.query : undefined, function(err, result) {
					if(_call_error_callback(err, config.error, mongoclient) == -1) {
						return;
					} else {
						result.toArray(function(err, array) {
							if(_call_error_callback(err, config.error, mongoclient) == -1) {
								return;								
							} else {
								mongoclient.close();
								if(config.success) {
									config.success(array);
								}
							}
						});
					}
				});
			}, config.data, config.error);
		},

		_mongo_updateSprint : function(config) {
			_mongoOp(function(mongoclient, collection, data) {
				if(!data || !data.id || !data.sprint) {
					_call_error_callback({reason : 'no id and/or data!'}, config.error, mongoclient);
					return;
				}

				collection.update({id : data.id}, {$set : data.sprint}, function(err, result) {
					if(_call_error_callback(err, config.error, mongoclient) == -1) {
						return;
					} else {
						mongoclient.close();
						if(config.success) {
							config.success({result : result});
						}
					}
				});
			}, config.data, config.error);
		},

		_mongo_deleteSprint : function(config) {
			_mongoOp(function(mongoclient, collection, data) {
				if(!data || !data.id) {
					_call_error_callback({reason : 'no id!'}, config.error, mongoclient);
					return;
				}

				collection.remove({id : data.id}, function(err, result) {
					if(_call_error_callback(err, config.error, mongoclient) == -1) {
						return;
					} else {
						mongoclient.close();
						if(config.success) {
							config.success({result : result});
						}
					}
				});

			}, config.data, config.error);
		}
	};
};

// mongoOp._mongo_addSprint({
// 	data : {sprint : sprints[0]},
// 	error : function(err) {
// 		console.log(err);
// 	},
// 	success : function() {
// 		console.log('sprint added successfully');
// 	}
// });


// mongoOp._mongo_getSprints({
// 	error : function(err) {
// 		console.log(err);
// 	},
// 	success : function(data) {
// 		console.log(data);
// 	}
// });

// sprints[0].name = 'Sprint 5k2k';

// mongoOp._mongo_updateSprint({
// 	data : {id : sprints[0].id, sprint : sprints[0]},
// 	error : function(err) {
// 		console.log(err);
// 	},
// 	success : function(res) {
// 		console.log(res);
// 	}
// });

// mongoOp._mongo_deleteSprint({
// 	data : {id : sprints[1].id},
// 	error : function(err) {
// 		console.log(err);
// 	},
// 	success : function(res) {
// 		console.log(res);
// 	}
// });




