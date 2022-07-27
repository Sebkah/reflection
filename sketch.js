let SEGMENTMANAGER;
let firstRay;

function setup() {
  createCanvas(800, 800);

  SEGMENTMANAGER = new SegmentManager(10);
  firstRay = SEGMENTMANAGER.addLiveRay(
    createVector(100, 400),
    createVector(800, 200)
  );
  /*   SEGMENTMANAGER.addLiveRay(createVector(0, 600), createVector(600, 100)); */

  SEGMENTMANAGER.addCollider(createVector(100, 100), createVector(700, 600));
  SEGMENTMANAGER.addCollider(createVector(20, 420), createVector(700, 400));

  //Adding borders
  SEGMENTMANAGER.addCollider(createVector(0, 0), createVector(0, width));
  SEGMENTMANAGER.addCollider(createVector(0, 0), createVector(width, 0));
  SEGMENTMANAGER.addCollider(
    createVector(width, 0),
    createVector(width, width)
  );
  SEGMENTMANAGER.addCollider(
    createVector(0, width),
    createVector(width, width)
  );

  /*   SEGMENTMANAGER.addRay(createVector(700, 100), createVector(0, 600));
  SEGMENTMANAGER.addRay(createVector(100, 100), createVector(0, 600)); */
  /*   let ray = SEGMENTMANAGER.addRay(
    createVector(random(0, width), random(0, width)),
    createVector(random(0, width), random(0, width))
  );
  ray.changeLength(10); */

  Physics.colliders = SEGMENTMANAGER.COLLIDERS;
}

function draw() {
  background(0);
  frameRate(10);

  firstRay.compute();

  /* SEGMENTMANAGER.compute(); */ //do not compute every ray when in recursive mode
  SEGMENTMANAGER.draw();
  SEGMENTMANAGER.cleanReflections();
}
