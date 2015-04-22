/*
** check the privilege of the user for each use case
*/

module.exports = {
	citizen: ['join_community', 'share_status','public_wall', 'private_chat','search_information','group_chat','offer_help','gps_location'],
    coordinator: ['post_announcement'],
    monitor: ['measure_performance','measure_memory'],
    administrator: ['admin_profile'],

    hasPrivilege : function(usecase, privilege_level, callback) {
    	if(privilege_level == 'CITIZEN') {
    		var flag = isEligible(usecase, this.citizen)
    		callback(flag);
    		return;
    	} else if(privilege_level == 'COORDINATOR') {
    		var flag = isEligible(usecase,this.citizen) || isEligible(usecase, this.coordinator);
    		callback(flag);
    		return;
    	} else if(privilege_level == 'MONITOR') {
    		var flag = isEligible(usecase, this.citizen) || isEligible(usecase, this.monitor);
    		callback(flag);
    		return;
    	} else if(privilege_level == 'ADMINISTRATOR') {
    		var flag = isEligible(usecase, this.citizen) || isEligible(usecase, this.coordinator) || isEligible(usecase, this.monitor) || isEligible(usecase, this.administrator);
    		callbacks(flag);
    	}

    },

    isEligible : function(usecase, scope) {
    	for(var i=0;i<scope.length;i++) {
    		if(scope[i] == usecase) {
    			return true;
    		}
    	}
    	return false;
    }
};