function SoundManager(){


	this.init = function() {
                   
            queue = new createjs.LoadQueue(false);
			queue.installPlugin(createjs.Sound);
			//queue.installPlugin(createjs.)
			queue.addEventListener("complete", handleComplete);
			queue.loadManifest([{id:"mapsound", src:"../sound/mapsound.mp3"}]);
			
  	}
 	

	function handleComplete(event) {
			
		createjs.Sound.play("mapsound");
	}
}