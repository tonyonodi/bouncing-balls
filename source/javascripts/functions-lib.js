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