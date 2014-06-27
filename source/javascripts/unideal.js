  

  var demoArea = $("#script-demo"),
      WIDTH = demoArea.width() - 17,
      HEIGHT = WIDTH * 0.4286,
      pauseFlag =  0, // Flag for checking if game should be paused.
      markFlag = 0;   // Flag for use in making one particle a different colour.

  /*********************
    OBJECT DEFINITIONS 
    GO HERE
  *********************/

  // Top level system class. Note that size and position are 3d vectors.
  function System(position, population) {
    
    // Define some properties.
    this.position = position || [0,0,0];  // Leave redundant for now.
    this.population = population;     // Total number of particles in system.
    
    // Define particle radius here.
    this.rad = HEIGHT / 35;

    // Define dimensions here.
    this.dimensions = addVect(
                        [WIDTH, HEIGHT, WIDTH], 
                        [2 * this.rad, 2 * this.rad, 2 * this.rad]
                      );        
    
    // Create particles.
    this.populate();
  }

  System.prototype.populate = function() {

    for(var i = 0; i < this.population; i++) {

      var partCoords = randomCoords( this.dimensions, 10000 );

      // Create temporary particle.
      var tempParticle = new Particle( partCoords, 16);
      
      particles.push(tempParticle);
      // Check for particle collision.
      /*if (tempParticle.detectPartCollision()) {
        i--;
      }

      // Add particle if no collision.
      else {
        this.particles.push(tempParticle);
      }*/

    }
  }



  //////////////////////////// Particle class.
  function Particle(pos, detail) {
    
    // Vector properties of particle.
    this.pos = pos;
    this.vel = randomCoords([800,800,800], 100);
    this.acc = [0,0,0];

    // Set ball material.
    if( !markFlag ) {
      var ballMaterial = new THREE.MeshPhongMaterial({color: 0x00FFFF}); 
      markFlag = 1;   // Flip mark flag so that no more balls are yellow.  
    }
    else {
      var ballMaterial = new THREE.MeshPhongMaterial({color: 0xCC0000});
    }
    
    // Mesh properties.
    this.detail = detail;
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.rad, 16, 16), ballMaterial)

    // Set position.
    this.mesh.position.set(this.pos[0], this.pos[1], this.pos[2]);

    // Define particle specific functions for updating and collision detection.
    this.updateParticle = updateParticle;
    this.detectWallCollision = detectWallCollision;
    this.detectPartCollision = detectPartCollision;

    // Add mesh to scene.
    scene.add(this.mesh);

  }

  function updateParticle(time) {
    
    // Multiply velocity vector by time change to find change in displacement.
    var deltaPos = multiplyVect(this.vel, (time/1000));

    // Update the position by adding the change in displacement.
    this.pos = addVect(this.pos, deltaPos);

    // Update mesh position.
    this.mesh.position.set(this.pos[0], this.pos[1], this.pos[2])
  }

  function detectPartCollision() {

    // Loop over all particles.
    for(var j = 0; j < particles.length; j++) {

      // Set up vars for particles that are easy to refer to.
      var iPart = this;
          jPart = particles[j];
      
      // Check for collision.
      if (vectorDist(iPart.pos, jPart.pos) < this.rad * 2 && vectorDist(iPart.pos, jPart.pos) != 0) {
        
        /****************
        POSITION CHANGES
        HAPPEN BELOW HERE
        *****************/
        
        // Find the distance the particles need to be moved to stop them overlapping.
        var overlap = (iPart.rad + jPart.rad) + 0.0001 - vectorDist(iPart.pos, jPart.pos);

        // Create unit vector for direction between particles. Multiply vector by distance scalar.
        var moveVector = unitVect(subVect(jPart.pos, iPart.pos)); 
            moveVector = multiplyVect(moveVector, overlap / 2);

        
        // Add amount needed to be moved to each particle.
        iPart.pos = subVect(iPart.pos, moveVector);
        jPart.pos = addVect(jPart.pos, moveVector);
        
        /****************
        VELOCITY CHANGES
        HAPPEN BELOW HERE
        *****************/
        
        // Take i and j velocities and find their components in the direction of collision.
        var iColVect = vectorProjection(iPart.vel, iPart.pos, jPart.pos),
            jColVect = vectorProjection(jPart.vel, iPart.pos, jPart.pos);

        // Changes i velocity var. Vi - Vic + Vjc.
        iPart.vel = subVect(iPart.vel, iColVect);
        iPart.vel = addVect(iPart.vel, jColVect);

        // Changes j velocity var. Vj - Vjc + Vic.
        jPart.vel = subVect(jPart.vel, jColVect);
        jPart.vel = addVect(jPart.vel, iColVect);
        
      }
    }
  }

  function detectWallCollision() {
    
    // Create a vector whose components are just inside of box in every dimension.
     var inside = [
      (this.dimensions[0] / 2) - this.rad - 0.0001,
      (this.dimensions[1] / 2) - this.rad - 0.0001,
      (this.dimensions[2] / 2) - this.rad - 0.0001];
    
    // Detect wall collisions in each dimension.
    for (var i=0; i<3; i++) {

      // Check if particle has collided with wall.
      if( Math.abs(this.pos[i]) >= (this.dimensions[i] / 2) - this.rad) {  

        // Reverse the velocity of the particle.
        this.vel[i] *= -1;  

        // Bring particle back inside box.
        this.pos[i] = inside[i] * // Set position to just inside box
                      this.pos[i] / Math.abs(this.pos[i]);  // Multiply by unit vecctor.
      }
    }
  }

  Particle.prototype = new System;

  //////////////////////////// Box Class
  function Box() {

  }

  Box.prototype = new System;

  /*********************
    OBJECT DEFINITIONS 
    END HERE
  *********************/






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

  /*********************
    FUNCTIONS 
    END HERE
  *********************/


// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, RESOLUTION = 10000, lastTime = (new Date()).getTime();

// Create array for particles
var particles = [], fpsFrameCount = 0;

// Get the output span element.
var output = document.getElementById("output");

// Create the scene and set the scene size.
scene = new THREE.Scene();


  // Create a renderer and add it to the DOM.
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  demoArea.append(renderer.domElement);
  renderer.domElement.id = "context"

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
  camera.position.set(0,0, WIDTH);
  scene.add(camera);

  // Add an event listener to adjust for resized window.
  window.addEventListener('resize', function() {
    var WIDTH = demoArea.width(),
        HEIGHT = WIDTH * 0.4286;

        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = 16/9;
        camera.updateProjectionMatrix();
  });

  // Create a light, set its position, and add it to the scene.
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0, 0.4*HEIGHT,WIDTH);
  scene.add(light);

  // Add OrbitControls so that we can pan around with the mouse.
  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  /*******************
  CREATE SYSTEM!
  *******************/  
                      // position, population.
  system = new System([0, 0, 0], 400);
  
  buildRoom(system.dimensions[0], system.dimensions[1]);

  animate();


/*******************
  ANIMATION LOOP!  
*******************/

function animate() {

  // Discover elapsed time since last frame.
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;

  // Reset timediff if it is too long.
  if (timeDiff > 200) {
    timeDiff = 200;
  }

  // Loop over entire array and update velocities and positions.
  for(var i = 0; i < system.population; i++) {

    // Detect particle particle collisions.
    particles[i].detectPartCollision();

    // Detect particle-wall collisions.
    particles[i].detectWallCollision();

    // Update particle positions.
    particles[i].updateParticle(timeDiff);
  }

  // Reset time.
  lastTime = time;

  // Do all that animation stuff.
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  controls.update();
}









/*******************
  VECTOR FUNCTIONS
  
  rewrite this as 
  a model!
*******************/

// Takes two points and finds the distance between them.
function vectorDist(a, b) {
  return Math.sqrt(
    Math.pow(a[0]-b[0], 2) +
    Math.pow(a[1]-b[1], 2) +
    Math.pow(a[2]-b[2], 2)
    );
}

// Finds the unit vector for a vector.
function unitVect(a) {
  var magnitude = magVect(a);
  return [a[0] / magnitude,
          a[1] / magnitude,
          a[2] / magnitude
  ];
}
// Finds the magnitude of a vector.
function magVect(a) {
  return Math.sqrt(
    a[0] * a[0] +
    a[1] * a[1] +
    a[2] * a[2]
    );
}

// Returns the sum of two vectors.
function addVect(a, b) {
  return [ a[0] + b[0],
           a[1] + b[1],
           a[2] + b[2]
          ];
}

// Returns the subtraction of two vectors.
function subVect(a, b) {
  return [ a[0] - b[0],
           a[1] - b[1],
           a[2] - b[2]
          ];
}

// Takes two vectors and finds the dot product.
function dotVect(a, b) {
  return [ a[0] * b[0]+
           a[1] * b[1]+
           a[2] * b[2]  
          ]; 
}

// Multiplies a vector with a scalar.
function multiplyVect(vector, scalar) {
  return [ scalar * vector[0],
           scalar * vector[1],
           scalar * vector[2]
          ];
}

// Takes a vector and finds its projection onto vector between two points.
function vectorProjection(vector, point1, point2) {
  
  // Find the unit vector for direction between two points.
  var unit = unitVect(subVect(point1, point2));
  
  // Find the dot product of the vector with the unit vector.
  var product = dotVect(vector, unit);
  
  return multiplyVect(unit, product);
}

/*******************
  END OF VECTOR 
  FUNCTIONS
*******************/