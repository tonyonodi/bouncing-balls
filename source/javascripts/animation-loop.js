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

  if (time - startTime > 8000) {
    // Reset timer.
    startTime = time;
    // Cause explosion to occur in a random position.
    //explosion();    
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
  //controls.update();
}