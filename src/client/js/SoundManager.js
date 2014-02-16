function SoundManager(){

	var audio;
	this.init = function() {             	
            var queue = new createjs.LoadQueue(false);
			queue.installPlugin(createjs.Sound);			
			queue.addEventListener("complete", handleComplete);
			queue.loadManifest([{id:"mapsound", src:"../sound/bgsound.mp3"}, {id:"laser", src:"../sound/laser.mp3"}
				]);		
  	}
 	
 	this.initGameSounds = function() {
 			createjs.Sound.registerSound({id:"laser",src:"../sound/laser.mp3" });
 			createjs.Sound.registerSound({id:"kiss",src:"../sound/kiss.mp3" });
 			createjs.Sound.registerSound({id:"push",src:"../sound/push.mp3" });	
		
 	}

	function handleComplete(event) {		
		createjs.Sound.play("mapsound", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
	}

	this.laserbeam = function() {
		 
		createjs.Sound.play("laser");
	}

	this.lovestruck = function() {
		 		
		createjs.Sound.play('kiss');
	}

	this.killed = function() {

		audio = new Audio('../sound/laser.mp3');	
		audio.play();
	}


	this.loving = function() {
		createjs.Sound.play('kiss');
	}

	this.buttonClick = function() {
		createjs.Sound.play("push");
	}
}