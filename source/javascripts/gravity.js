//= require "vector-lib"
//= require "animation-loop"
//= require "system-object"
//= require "particle-object"


var demoArea = document.querySelector("#gravity-demo"),
      WIDTH = demoArea.offsetWidth,
      HEIGHT = WIDTH * 0.4286,
      pauseFlag =  0; // Flag for checking if game should be paused.
  

  Particle.prototype = new System;


  /*********************
    FUNCTIONS 
    START HERE
  *********************/

  // Generates random coordinates centered around zero. Pass 3D array for range!
  function randomCoords(range, resolution) {
    return [
      randomGen(range[0], resolution),
      randomGen(range[1], resolution),
      randomGen(range[2], resolution)
      ];
  }

  function randomGen(range, resolution) {

        // Generate random between 0 and 1, multiply by resolution and centre on zero.
    var returnVar = (Math.random()*resolution) - (resolution/2)
        // Make it an integer between -resolution/2 and resolution. Convert to float.
        returnVar = parseFloat( Math.floor(returnVar) );
        // Divide by by resolution so it's between -0.5 and 0.5.
        returnVar /= resolution;
        // Multiply by range for final answer.
        returnVar *= parseFloat(range);

    return returnVar;
  }

  function buildRoom(wallWidth, wallHeight) {

    // Set up generic wall material.
    var wallMaterial = new THREE.MeshLambertMaterial(
      {color: 0xC0C0C0,
      opacity: 0.5,
      transparent: true}
      );

    // Add the back wall.
    var backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(wallWidth, wallHeight),
      wallMaterial);
        
    backWall.position.z = -wallWidth/2;

    scene.add(backWall);

    // Add the left wall.
    var leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(wallWidth, wallHeight),
      wallMaterial);
    
    leftWall.position.x = -wallWidth/2;
    leftWall.rotation.y = Math.PI / 2;

    scene.add(leftWall);
    
    // Add the right Wall.
    var rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(wallWidth, wallHeight),
      wallMaterial);
    
    rightWall.position.x = wallWidth/2;
    rightWall.rotation.y = - Math.PI / 2;

    scene.add(rightWall);

    // Add the floor.
    var floorWall = new THREE.Mesh(
      new THREE.PlaneGeometry(wallWidth, wallWidth),
      wallMaterial);
    
    floorWall.position.y = -wallHeight/2;
    floorWall.rotation.x = - Math.PI / 2;

    scene.add(floorWall);

  }


  function getClickLocation(screenX, screenY) {

    // This function takes the coordinates of an on screen click and translates
    // that into a line containing all possible locations of the click. It then
    // finds the point at which that line intersects the plane of the floor.

    var pointOnVector = [0,0, WIDTH], // Position of camera - used as a point on the line.
        pointOnPlane = [0, -(HEIGHT + (2 * system.rad)) / 2, 0] // Point under origin.
        normalToPlane = [0, 1, 0]; // Vector that is normal to the plane under origin.

    // Find the size of the screen in 3d space.
    var nearFulcrumHeight = Math.tan( Math.PI / 8 );
    var nearFulcrumWidth = nearFulcrumHeight * (WIDTH / HEIGHT);
    
    // Point on screen clicked in 3d space.
    var clickInSpace = [screenX * nearFulcrumWidth, screenY * nearFulcrumHeight, WIDTH - 1]; 
    // Subtract point on screen from camera vector.
    var lineVector = subVect( clickInSpace , pointOnVector ); 

    // Find distance along line from camera that intersection occurs.
    var intersectionDistance = subVect( pointOnPlane, pointOnVector );
        intersectionDistance = dotVect( intersectionDistance, normalToPlane );
        intersectionDistance = intersectionDistance / dotVect( lineVector, normalToPlane );

    // Now find the point in space at which the intersection occurs.
    var intersectionPoint = multiplyVect( lineVector, intersectionDistance   );
        intersectionPoint = addVect( intersectionPoint, pointOnPlane );

    return  pointOnPlane;
  }

  function explosion() {
    
    // Randomly generate a place for explosion to occur.
    var explosionPos = randomCoords( [system.dimensions[0], system.dimensions[1] / 2, system.dimensions[2]], 10000 );
    var oneLoopFlag = 1
    // Loop over all particles to find the effect of explosion on them.
    for(var i = 0; i < particles.length; i++) {

      // Calculate speed change explosion gives current particle.
      var explosionDistance = vectorDist(particles[i].pos, explosionPos);
      var explosionSpeed = 1000000 / (explosionDistance);
      //if(oneLoopFlag) alert(explosionSpeed);
      // Find unit vector for the direction of the explosion.
      var explosionDirection = subVect(particles[i].pos, explosionPos)
      explosionDirection = unitVect(explosionDirection);

      // Multiply speed by unit vector to get explosion vector.
      explosionVelocity = multiplyVect( explosionDirection, explosionSpeed );

      // Add the explosion vector to particle velocity vector.
      particles[i].vel = addVect( particles[i].vel, explosionVelocity );

      oneLoopFlag = 0;
    }
  }

  /*********************
    FUNCTIONS 
    END HERE
  *********************/


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