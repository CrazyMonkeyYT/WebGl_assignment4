/*
COMP 370 assignment #4: Affine Transformations in a WebGL Application
Thomas Williamson
id: 588206
2021/11/16
*/
"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var transf = [0, 0, 0];
var translationLoc;
var scaile = [1, 1, 1];
var scailLoc;
var numElements = 15;


    var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  -0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  -0.5),
        // vec3(-0.5, -0.5, -0.5),
        // vec3(-0.5,  0.5, -0.5),
        // vec3(0.5,  0.5, -0.5),
        // vec3(0.5, -0.5, -0.5)
    ];

    var vertexColors = [
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    ];

// indices of the 12 triangles that compise the cube

var indices = [
    0, 1, 2, 255,
    0, 1, 3, 255,
    0, 2, 3, 255,
    3, 2, 1, 
];

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(210/255, 210/255, 210/255, 1.0);

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.PRIMITIVE_RESTART_FIXED_INDEX);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    translationLoc = gl.getUniformLocation(program, "transform");
    scailLoc = gl.getUniformLocation(program, "scaling");

   // console.log(gl.getUniformLocation(program, ""));

    //event listeners for buttons
    document.getElementById("Test1Button").onclick = function(){

        document.getElementById("RotateY").value = parseFloat(document.getElementById("RotateY").value) - 45;
        document.getElementById("ScaleX").value = parseFloat(document.getElementById("ScaleX").value) + .2;
    };

    document.getElementById("Test2Button").onclick = function(){
        document.getElementById("ScaleX").value = parseFloat(document.getElementById("ScaleX").value) + .2;
        document.getElementById("RotateY").value = parseFloat(document.getElementById("RotateY").value) - 45;
    };

    document.getElementById("Reset").onclick =  function(){ 
        document.getElementById("ScaleY").value = 1;
        document.getElementById("ScaleX").value = 1;
        document.getElementById("ScaleZ").value = 1;
        document.getElementById("TranslateX").value = 0;
        document.getElementById("TranslateY").value = 0;
        document.getElementById("TranslateZ").value = 0;
        document.getElementById("RotateX").value = 180;
        document.getElementById("RotateY").value = 180;
        document.getElementById("RotateZ").value = 180;        
    };

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 //   console.log(document.getElementById("RotateX").value);
    theta[xAxis] = document.getElementById("RotateX").value;
    theta[yAxis] = document.getElementById("RotateY").value;
    theta[zAxis] = document.getElementById("RotateZ").value;
    transf[0] = document.getElementById("TranslateX").value;
    transf[1] = document.getElementById("TranslateY").value;
    transf[2] = document.getElementById("TranslateZ").value;
    scaile[0] = document.getElementById("ScaleX").value;
    scaile[1] = document.getElementById("ScaleY").value;
    scaile[2] = document.getElementById("ScaleZ").value;


    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(translationLoc, transf);
    gl.uniform3fv(scailLoc, scaile);


    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(render);
}
