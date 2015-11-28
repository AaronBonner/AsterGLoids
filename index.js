function main() {
	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	
	initGL(gl,drawShip,[]);
}

function getShadersFromXHR(vertexShaderURL,fragmentShaderURL,callback) {
	var VSHADER_SOURCE = '';
	var FSHADER_SOURCE = '';

	$.ajax({
		url: vertexShaderURL,
		dataType: "text",
		cache: false
	}).done(function(data) {
		VSHADER_SOURCE = data;
		$.ajax({
			url: fragmentShaderURL,
			dataType: "text",
			cache: false
		}).done(function(data) {
			FSHADER_SOURCE = data;
			shaders = {'VSHADER_SOURCE':VSHADER_SOURCE,'FSHADER_SOURCE':FSHADER_SOURCE};
			console.log(shaders);
			callback(shaders);
		});
	});
}

function initGL(gl,callback,callbackArgs) {
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	
	var VSHADER_SOURCE = '';
	var FSHADER_SOURCE = '';
	
	getShadersFromXHR('shaders/shader1.vshader','shaders/shader1.fshader',function (shaders){
		VSHADER_SOURCE = shaders['VSHADER_SOURCE'];
		FSHADER_SOURCE = shaders['FSHADER_SOURCE'];
		console.log('gotshaders');
		
		if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
			console.log('Failed to initialize shaders.');
			return;
		}
		
		console.log('vshader:');
		console.log(VSHADER_SOURCE);
		console.log('fshader:');
		console.log(FSHADER_SOURCE);
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		gl.clear(gl.COLOR_BUFFER_BIT);
		
		return callback.apply(this,callbackArgs);
	});
}



function drawShip(gl){
	console.log('stuff goes here');
}