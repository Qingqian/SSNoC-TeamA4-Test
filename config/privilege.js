/*
** check the privilege of the user for each use case
*/

module.exports = {
	citizen: ['join_community', 'share_status','public_wall', 'private_chat','search_information','group_chat','offer_help','gps_location'],
    coordinator: ['post_announcement'],
    monitor: ['monitor_performance','monitor_memory'],
    administrator: ['admin_profile'],

    hasPrivilege : function(usecase, privilege_level) {
        var flag;
    	if(privilege_level == 'CITIZEN') {
    		flag = this.isEligible(usecase, this.citizen)
    	} else if(privilege_level == 'COORDINATOR') {
    		flag = this.isEligible(usecase,this.citizen) || this.isEligible(usecase, this.coordinator);
    	} else if(privilege_level == 'MONITOR') {
    		flag = this.isEligible(usecase, this.citizen) || this.isEligible(usecase, this.monitor);
    	} else if(privilege_level == 'ADMINISTRATOR') {
    		flag = this.isEligible(usecase, this.citizen) || this.isEligible(usecase, this.coordinator) || this.isEligible(usecase, this.monitor) || this.isEligible(usecase, this.administrator);
    	}
        return flag;
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