(function() {
    
    'use strict';

    angular
        .module('timeTracker')
        .factory('time', time);

        function time($resource) {

            // ngResource call to our static data
            var Time = $resource('api/time/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });



            function getTime() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Time.query().$promise.then(function(results) {
                	angular.forEach(results, function(result){
                		result.loggedTime = getTimeDiff(result.start_time, result.end_time);
                	});
                    return results;
                }, function(error) { // Check for errors
                    console.log(error);
                });
            }

            function getTimeDiff(start, end){
            	var diff = moment(end).diff(moment(start));
            	var duration = moment.duration(diff);
            	return {
            		duration: duration
            	}
            }

            function getTotalTime(timeentries){
            	var totalMilliseconds = 0;

            	angular.forEach(timeentries, function(key){
            		totalMilliseconds += key.loggedTime.duration._milliseconds;
            	});

            	return {
            		hours: Math.floor(moment.duration(totalMilliseconds).asHours()),
            		minutes: moment.duration(totalMilliseconds).minutes()
            			
            	}
            }


            function saveTime(data){
                return Time.save(data).$promise.then(function(success){
                    console.log(success);
                }, function(error){
                    console.log(error);
                })
            }

            function updateTime(data){
                return Time.update({id:data.id}, data).$promise.then(function(success){
                    console.log(success);
                }, function(error){
                    console.log(error);
                })
            }

            function deleteTime(id){
                return Time.delete({id:id}).$promise.then(function(success){
                    console.log(success);
                }, function(error){
                    console.log(error);
                });
            }

            return {
                getTime: getTime,
                getTimeDiff: getTimeDiff,
                getTotalTime: getTotalTime,
                saveTime: saveTime,
                updateTime: updateTime
            }
        }
            
})();