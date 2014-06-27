function Particle(pos, detail) {
  
  // Vector properties of particle.
  this.pos = pos;
  this.vel = [0, 0, 0];
  this.acc = this.grav;

  // Set elasticitiy.
  this.elasticitiy = 0.9;
  
  // Mesh properties.
  this.detail = detail;
  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(this.rad, 16, 16),
    new THREE.MeshPhongMaterial({color: 0xCC0000}));

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

  // Multiply acceleration vector by time change to find change in displacement.
  var deltaVel = multiplyVect(this.acc, (time/1000));
  
  // Update the position by adding the change in displacement.
  this.vel = addVect(this.vel, deltaVel);

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

      // Account for elasticity.
      iPart.vel = multiplyVect(iPart.vel, 0.9);
      jPart.vel = multiplyVect(jPart.vel, 0.9);
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
    if( Math.abs(this.pos[i]) >= (this.dimensions[i] / 2) - this.rad && i != 1) {  

      // Reverse the velocity of the particle.
      this.vel[i] *= -1;  

      // Account for elasticity.
      this.vel = multiplyVect(this.vel, 0.9);

      // Bring particle back inside box.
      this.pos[i] = inside[i] * // Set position to just inside box
                    this.pos[i] / Math.abs(this.pos[i]);  // Multiply by unit vecctor.
    }
  }

  // Check if particle has collided with wall.
  if( Math.abs(this.pos[1]) >= (this.dimensions[1] / 2) - this.rad && this.pos[1] < 0) {  
      
    // Reverse the velocity of the particle.
    this.vel[1] *= -1;  

    // Account for elasticity.
    this.vel = multiplyVect(this.vel, 0.9);

    // Bring particle back inside box.
    this.pos[1] = inside[1] * // Set position to just inside box
                  this.pos[1] / Math.abs(this.pos[1]);  // Multiply by unit vecctor.
  }
}