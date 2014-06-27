// Top level system class. Note that size and position are 3d vectors.
  function System(position, population) {
    
    // Define some properties.
    this.position = position || [0,0,0];  // Leave redundant for now.
    this.population = population;     // Total number of particles in system.
    
    // Define particle radius here.
    this.rad = 50;

    // Define dimensions here.
    this.dimensions = addVect(
                        [WIDTH, HEIGHT, WIDTH], 
                        [2 * this.rad, 2 * this.rad, 2 * this.rad]
                      );     

    // Define gravity (has been scaled up!).
    this.grav = [0, -200, 0]   
    
    // Create particles.
    this.populate();
  }

  System.prototype.populate = function() {

    for(var i = 0; i < this.population; i++) {

      var partCoords = randomCoords( this.dimensions, 10000 );

      // Create temporary particle.
      var tempParticle = new Particle( partCoords, 16);
      
      particles.push(tempParticle);

    }
  }