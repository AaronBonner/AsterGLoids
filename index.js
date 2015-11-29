function main() {
	window.context = new glContext("webgl");
	window.gl = context.gl;
	gl.clearColor(0, 0, 0, 1);
	console.log(context);
	getObjectResources(['shaders/shader1.vshader','shaders/shader1.fshader'],function(resourceArray){
		var vertices = new Float32Array([   // Vertex coordinates
			1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
			1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
			1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
			-1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
			-1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
			1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
		]);

		var colors = new Float32Array([     // Colors
			0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
			0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
			1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
			1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
			1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
			0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
		]);

		var indices = new Uint8Array([       // Indices of the vertices
			0, 1, 2,   0, 2, 3,    // front
			4, 5, 6,   4, 6, 7,    // right
			8, 9,10,   8,10,11,    // up
			12,13,14,  12,14,15,    // left
			16,17,18,  16,18,19,    // down
			20,21,22,  20,22,23     // back
		]);
		console.log(resourceArray);
		context.addGLObject(new ship(resourceArray[0],resourceArray[1],vertices,colors,indices).init());
	});
	
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

function ship(vertexShaderSource,fragmentShaderSource,vertexArray,vertexColorsArray,elementIndexArray){
	this.last_update = Date.now();
	this.initialized = false;
	this.vertices = vertexArray;
	this.colors = vertexColorsArray;
	this.indices = elementIndexArray;
	
	this.init = function(){
		console.log('heres where we init the shaders, buffers, and other things');
		
		if (!this.initShaders(gl, vertexShaderSource,fragmentShaderSource)){
			console.log('failed to init shaders.');
			return -1;
		}
		
		this.indexBuffer = gl.createBuffer();
		if (!this.indexBuffer) {
			return -1;
		}

		// Write the vertex coordinates and color to the buffer object
		if (!this.initArrayBuffer(gl, this.vertices, 3, gl.FLOAT, 'a_Position')){
			return -1;
		}

		if (!this.initArrayBuffer(gl, this.colors, 3, gl.FLOAT, 'a_Color')){
			return -1;
		}
		
		gl.enable(gl.DEPTH_TEST);
		
		this.initialized = true;
		return this;
	}
	
	this.draw = function(){
		this.animate(Date.now() - this.last_update);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
		
		var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
		if (!u_MvpMatrix) {
			console.log('Failed to get the storage location of u_MvpMatrix');
			return;
		}

		// Set the eye point and the viewing volume
		var mvpMatrix = new Matrix4();
		mvpMatrix.setPerspective(30, 1, 1, 100);
		mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

		// Pass the model view projection matrix to u_MvpMatrix
		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
	};

	this.animate = function(elapsed){
	};
	
	this.initArrayBuffer = function(gl, data, num, type, attribute) {
		var buffer = gl.createBuffer();   // Create a buffer object
		if (!buffer) {
			console.log('Failed to create the buffer object');
			return false;
		}
		// Write date into the buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		// Assign the buffer object to the attribute variable
		var a_attribute = gl.getAttribLocation(gl.program, attribute);
		if (a_attribute < 0) {
			console.log('Failed to get the storage location of ' + attribute);
			return false;
		}
		gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
		// Enable the assignment of the buffer object to the attribute variable
		gl.enableVertexAttribArray(a_attribute);

		return true;
	}
	
	this.initShaders = function(gl,vertexShaderSource,fragmentShaderSource){
		this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		
		if (!this.vertexShader || !this.fragmentShader) {
			console.log('failed to load shaders');
			return null;
		}
		
		this.program = gl.createProgram();
			if (!this.program) {
			return null;
		}
		
		gl.attachShader(this.program, this.vertexShader);
		gl.attachShader(this.program, this.fragmentShader);
		
		gl.linkProgram(this.program);
		
		var linked = gl.getProgramParameter(this.program, gl.LINK_STATUS);
		if (!linked) {
			var error = gl.getProgramInfoLog(this.program);
			console.log('Failed to link program: ' + error);
			gl.deleteProgram(this.program);
			gl.deleteShader(this.fragmentShader);
			gl.deleteShader(this.vertexShader);
			return null;
		}
		
		gl.useProgram(this.program);
		gl.program = this.program;
		
		return true;
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