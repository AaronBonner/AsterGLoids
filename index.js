function main() {
	window.context = new glContext("webgl");
	window.gl = context.gl;
	gl.clearColor(0, 0, 0, 1);
	console.log(context);
	var tick = function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		for(i=0;i<context.glObjects.length;i++){
			context.glObjects[i].draw();
		}
		requestAnimationFrame(tick, context.canvas);
	};
	tick();
}

function glContext(canvasID){
	this.glObjects = [];
	this.canvas = document.getElementById(canvasID);
	this.gl = getWebGLContext(this.canvas);
	console.log(this.gl);
	
	this.addGLObject = function(glObj){
		console.log('adding gl object:');
		console.log(glObj);
		this.glObjects.push(glObj);
	}
}

function ship(vertexShaderSource,fragmentShaderSource,vertexArray,vertexColorsArray,elementIndexArray,callback){
	this.last_update = Date.now();
	this.initialized = false;
	this.init = function(){
		console.log('heres where we init the shaders, buffers, and other things');
	}
	
	this.draw = function(){
		this.animate(Date.now() - this.last_update);
		console.log('here is where things would be drawn');
	};

	this.animate = function(elapsed){
		console.log('Elapsed time is ' + elapsed.toString());
	}
}

function getResourceAsync(url,callback,callbackArgsArray){
	console.log('Beginning ajax request for: ' + url.toString());
	$.ajax({
			url: url,
			dataType: "text",
			contentType: "text/plain",
			cache: false
		}).done(function(data) {
			console.log('Calling back from ajax request for: ' + url.toString() + 'with data: ' + data.toString());
			argsArray = [data];
			for(i=0;i<callbackArgsArray.length;i++){
				argsArray.push(callbackArgsArray[i]);
			}
			callback(data,callbackArgsArray);
		});
}

function getObjectResources(resourceUrls,callback){
	var resourceReadyStatuses = [];
	var fetchedResources = [];
	console.log(resourceUrls);
	for(i=0;i<resourceUrls.length;i++){
		resourceReadyStatuses[i] = false;
		console.log('calling getResourceAsync' );
		getResourceAsync(resourceUrls[i],function(data,callbackArgsArray){
			console.log('Setting fetchedResources['+i.toString()+'] to data: ' + data.toString());
			fetchedResources[callbackArgsArray[0]] = data;
			resourceReadyStatuses[callbackArgsArray[0]] = true;
		},[i]);
	}
	
	var interval = setInterval(checkResources, 20);
	function checkResources(){
		ready = true;
		for(i=0;i<resourceReadyStatuses.length;i++){
			if( resourceReadyStatuses[i] != true){
				ready = false;
				break;
			}
		}
		if(ready){
			clearInterval(interval);
			return callback(fetchedResources);
		}
	}
}