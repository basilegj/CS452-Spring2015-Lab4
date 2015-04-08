//Greg Basile

var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];
var colorArray = [];

var rand_i; 

var vertices = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 )
];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var texCoordsArray = [];
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var thetaLoc;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


var colors = [
    vec4(0, 0, 0, 1), // black
    vec4(1.0, 0, 0, 1), // red
    vec4(1.0, 1.0, 0, 1), // yelow
    vec4(0, 1.0, 0, 1), // green
    vec4(0, 0, 1.0, 1), // blue
    vec4(1.0, 0, 1.0, 1), // magenta
    vec4(0, 1.0, 1.0, 1),   // cyan  /**/
		vec4(1.0, 1.0, 1.0, 1.0) // white    
];

var vertexColors = [
    vec4(0, 0, 0, 1), // black
    vec4(1.0, 0, 0, 1), // red
    vec4(1.0, 1.0, 0, 1), // yelow
    vec4(0, 1.0, 0, 1), // green
    vec4(0, 0, 1.0, 1), // blue
    vec4(1.0, 0, 1.0, 1), // magenta
    vec4(0, 1.0, 1.0, 1),   // cyan  /**/
    vec4(1.0, 1.0, 1.0, 1.0) // white    
];

var normal, a;
function calc_normal(){
  a = vec3(0,0,0);
  a[0] = Math.floor((100-0)*Math.random()) % 8;
  a[1] = Math.floor((100-0)*Math.random()) % 8;
  a[2] = Math.floor((100-0)*Math.random()) % 8;

  var A = a[0];
  var b = a[1];
  var c = a[2];

  var t1 = subtract(vertices[b], vertices[A]);
  var t2 = subtract(vertices[c], vertices[b]);

  normal = cross(t1, t2);
  console.log(normal);

  normal = vec3(normal);
  console.log(normal);

}

function quad() {  
  calc_normal();

  pointsArray.push(vertices[a[0]]); 
  normalsArray.push(normal); 
	colorArray.push(colors[a[0]]); 
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[a[1]]); 
  normalsArray.push(normal); 
  colorArray.push(colors[a[1]]); 
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[a[2]]); 
  normalsArray.push(normal);   
  colorArray.push(colors[a[2]]); 
  texCoordsArray.push(texCoord[2]);

  calc_normal();

  pointsArray.push(vertices[a[0]]); 
  normalsArray.push(normal); 
  colorArray.push(colors[a[0]]); 
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[a[1]]); 
  normalsArray.push(normal); 
  colorArray.push(colors[a[1]]); 
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a[2]]); 
  normalsArray.push(normal);    
  colorArray.push(colors[a[2]]); 
  texCoordsArray.push(texCoord[3]);
  /*console.log("normal value = ")
  console.log(normal);
  console.log("Normal array  = ")
  console.log(normalsArray);/**/

}
/**/


function colorCube()
{
    quad(  );
    quad( );
    quad( );
    quad(  );
    quad( );
    quad(  );
}

window.onload = function init() {
  canvas = document.getElementById( "gl-canvas" );
  
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  colorCube();

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW );
  
  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
  
  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta"); 
  
  viewerPos = vec3(0.0, 0.0, -20.0 );

  projection = ortho(-1, 1, -1, 1, -100, 100);
  
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
     flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
     flatten(diffuseProduct) );
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
     flatten(specularProduct) );	
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
     flatten(lightPosition) );
     
  gl.uniform1f(gl.getUniformLocation(program, 
     "shininess"),materialShininess);
  
  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
     false, flatten(projection));
  modelView = mat4();

  var tBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
  
  var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
  gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTexCoord );
	
  var image = document.getElementById("texImage");
  configureTexture( image );

	render();
}

var render = function(){
            
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    modelCube();
              
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
            
            
    requestAnimFrame(render);
}

window.addEventListener( "keydown", function(event){
	var key = String.fromCharCode(event.keyCode);
	//console.log(key);

	switch ( key ) {
			case '%':
				theta[1] -= 2.0;
				break;
			case "'": 
				theta[1] += 2.0;
				break;
			case '&':
				theta[0] += 2.0;
				break;	
			case '(':
				theta[0] -= 2.0;
				break;
				
			default:
	}
} );

function modelCube(){
	modelView = mat4();
    	modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    	modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    	modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
}
