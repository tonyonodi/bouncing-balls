//= require "vector-lib"
//= require "functions-lib"
//= require "system-object"
//= require "particle-object"
//= require "animation-loop"

var demoArea = document.querySelector("#gravity-demo"),
    WIDTH = demoArea.offsetWidth,
    HEIGHT = WIDTH * 0.4286,
    pauseFlag =  0; // Flag for checking if game should be paused.

Particle.prototype = new System;

// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, RESOLUTION = 10000, lastTime = (new Date()).getTime();
var startTime = lastTime;

// Create array for particles
var particles = [], fpsFrameCount = 0;

// Get the output span element.
var output = document.getElementById("output");

// Create the scene and set the scene size.
scene = new THREE.Scene();


// Create a renderer and add it to the DOM.
renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
demoArea.appendChild( renderer.domElement );


// Create a camera, zoom it out from the model a bit, and add it to the scene.
camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 20000);
camera.position.set(0,0, WIDTH);
scene.add(camera);

// Add an event listener to adjust for resized window.
window.addEventListener('resize', function() {
  var WIDTH = demoArea.offsetWidth,
      HEIGHT = WIDTH * 0.4286;

      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH/HEIGHT;
      camera.updateProjectionMatrix();
});

// Create a light, set its position, and add it to the scene.
var light = new THREE.PointLight(0xffffff);
light.position.set(0, 0.4*HEIGHT,WIDTH);
scene.add(light);

// Add OrbitControls so that we can pan around with the mouse.
//controls = new THREE.OrbitControls(camera, renderer.domElement);

// Add a click listener.
demoArea.click(function() {
  explosion();
});

/*******************
CREATE SYSTEM!
*******************/  
                    // position, population.
system = new System([0, 0, 0], 500);

buildRoom(system.dimensions[0], system.dimensions[1]);

animate();