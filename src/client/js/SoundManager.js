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
 			createjs.Sound.registerSound({id:"laser",src:"../sound/laser.mp3",
 										  id: "click", src:"../sound/click.mp3"});
		
 	}

	function handleComplete(event) {		
		createjs.Sound.play("mapsound", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
	}

	this.laserbeam = function() {
		 
		createjs.Sound.play("laser");
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

	this.buttonClick = function() {
		createjs.Sound.play("click");
	}
}