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

function ship(vertexShaderUrl,fragmentShaderUrl,vertexArray,vertexColorsArray,elementIndexArray,callback){
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