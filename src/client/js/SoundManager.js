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
 			//var queue2 = new createjs.LoadQueue(false);
			//queue2.installPlugin(createjs.Sound);			
			//queue2.addEventListener("complete", laserbeam);
			//queue2.loadManifest([{id:"laser", src:"../sound/laser.mp3"}]);
				
			
 	}

	function handleComplete(event) {		
		createjs.Sound.play("mapsound", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
	}

	this.laserbeam = function() {
		 
		audio = new Audio('../sound/laser.mp3');	
		audio.play();
	}

	this.lovestruck = function() {
		 		
		audio = new Audio('../sound/love.mp3');	
		audio.play();
	
	}

	this.killed = function() {

		audio = new Audio('../sound/laser.mp3');	
		audio.play();
	}


	this.loving = function() {
		audio = new Audio('../sound/laser.mp3');	
		audio.play();
	}
}