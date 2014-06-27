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