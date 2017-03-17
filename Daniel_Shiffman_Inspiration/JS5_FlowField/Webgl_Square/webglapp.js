var vertextShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');
var fragmentShaderText = 
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');



var initdemo = function() {
    console.log("This is working")
    
    var canvas = document.getElementById('window-surface');

    //Step one is init webgl;
    var gl = canvas.getContext('webgl');

    if(!gl){
        console.log("WebGl not supported, using experimental-webgl");
        gl = canvas.getContext('experimental-webgl');
    }

    if(!gl){
        alert("Your browser sucks");
    }

    //canvas.width =  window.innerWidth;
    //canvas.height =  window.innerHeight;
   // gl.viewport(0,0, window.innerWidth, window.innerHeight);

    //gl.clearColor(R, G, B , A);
    
    gl.clearColor(.75, .85, .8, 1);
    //fixes drawing depth
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    //gl.clear(argument) 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //vertex shader: 

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertextShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("error linking program", gl.getProgramInfoLog(program));
        return;
        }
    
    
    gl.validateProgram(program);
     if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
         console.error("error validating program!", gl.getProgramInfoLog(program));
         return;
     }

     //
     //CreateBuffer
     //

     var boxVertices = 
     [ // X , Y // counter clockwise; R , G , B
        // Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
     ];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

     var triangleVertexBufferObject = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
     //gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

     var boxIndexBufferObject = gl.createBuffer();
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


     var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
     var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

     gl.vertexAttribPointer(
        positionAttribLocation, //attribute location in our c file
        3, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.False,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of inidividual vertextShaderText
        0 // offset from the beginning of a single vertex to this attribute
     );
    gl.vertexAttribPointer(
        colorAttribLocation, //attribute location in our c file
        3, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.False,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of inidividual vertextShaderText
        3 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
     );
     
     gl.enableVertexAttribArray(positionAttribLocation);
     gl.enableVertexAttribArray(colorAttribLocation);


      gl.useProgram(program);

     var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
     var matViewUniformLocation  = gl.getUniformLocation(program, 'mView');
     var matProjUniformLocation  = gl.getUniformLocation(program, 'mProj');

     // IENTITY MATRICES 
     var worldMatrix = new Float32Array(16);
     var viewdMatrix = new Float32Array(16);
     var projMatrix  = new Float32Array(16);

     mat4.identity(worldMatrix);
     mat4.lookAt(viewdMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
     mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
     
     // SEND TO GPU

     gl.uniformMatrix4fv(matWorldUniformLocation, gl.FLASE, worldMatrix);
     gl.uniformMatrix4fv(matViewUniformLocation,  gl.FLASE, viewdMatrix);
     gl.uniformMatrix4fv(matProjUniformLocation,  gl.FLASE, projMatrix);


     var xRotationMatrix = new Float32Array(16);
     var yRotationMatrix = new Float32Array(16);

     //
     // Main render Loop
     //
     var identityMatrix =  new Float32Array(16);
     mat4.identity(identityMatrix);
     var angle = 0;
     var loop = function () {

         angle = performance.now()/1000/6 * 2 * Math.PI;
         mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
         mat4.rotate(xRotationMatrix, identityMatrix, angle / 4 , [1, 0, 0]);
         mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
         gl.uniformMatrix4fv(matWorldUniformLocation, gl.FLASE, worldMatrix);
         gl.clearColor(0.75,0.85,0.8,1.0);
         gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
         gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0 );

        requestAnimationFrame(loop);
     };
     requestAnimationFrame(loop);


};
















/*function vertexShader(vertPosition, vertColor ) {
    return {
        fragColor: vertColor,
        gl_Position: [vertPosition.x, vertPosition.y,  0.0, 0.1]
    };
};*/


