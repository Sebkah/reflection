let SEGMENTMANAGER;
let firstRay;

function setup() {
  createCanvas(800, 800);

  angleMode(DEGREES);

  SEGMENTMANAGER = new SegmentManager(5, true, false);
  /*   firstRay = SEGMENTMANAGER.addLiveRay(
    createVector(100, 400),
    createVector(800, 200)
  ); */
  /*   SEGMENTMANAGER.addLiveRay(createVector(0, 600), createVector(600, 100)); */

  SEGMENTMANAGER.addSegmentCollider(
    createVector(100, 100),
    createVector(700, 600)
  );
  SEGMENTMANAGER.addSegmentCollider(
    createVector(20, 420),
    createVector(700, 400)
  );

  SEGMENTMANAGER.addLight(4000, createVector(500, 10), 2000);

  //Adding borders
  SEGMENTMANAGER.addSegmentCollider(createVector(0, 0), createVector(0, width));
  SEGMENTMANAGER.addSegmentCollider(createVector(0, 0), createVector(width, 0));
  SEGMENTMANAGER.addSegmentCollider(
    createVector(width, 0),
    createVector(width, width)
  );
  SEGMENTMANAGER.addSegmentCollider(
    createVector(0, width),
    createVector(width, width)
  );
  SEGMENTMANAGER.addCircleCollider(createVector(100, 100), 100);
  SEGMENTMANAGER.addCircleCollider(createVector(400, 400), 200);
  SEGMENTMANAGER.addCircleCollider(createVector(390, 400), 150);
  SEGMENTMANAGER.addCircleCollider(createVector(40, 200), 20);

  /*   SEGMENTMANAGER.addRay(createVector(700, 100), createVector(0, 600));
  SEGMENTMANAGER.addRay(createVector(100, 100), createVector(0, 600)); */
  /* let ray = SEGMENTMANAGER.addRay(
    createVector(random(0, width), random(0, width)),
    createVector(random(0, width), random(0, width))
  ); */
  /*   ray.changeLength(10); */

  Physics.colliders = SEGMENTMANAGER.COLLIDERS;
}

function draw() {
  /*  blendMode(LIGHTEST); */
  background(0, 255);
  /*   frameRate(10); */

  /*  firstRay.compute(); */

  SEGMENTMANAGER.compute(); //do not compute every ray when in recursive mode
  SEGMENTMANAGER.draw();
  SEGMENTMANAGER.cleanReflections();
}
