// Always remember to state the immediate purpose of a module
// This module is intended for PoC use only
NeedsTesting = function(){
	this.returnTrue = function(){
		return true;
	};
	this.returnFalse = function(){
		return false;
	};
}
module.exports = NeedsTesting;