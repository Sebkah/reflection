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

  /*   SEGMENTMANAGER.addSegmentCollider(
    createVector(100, 100),
    createVector(700, 600)
  );
  SEGMENTMANAGER.addSegmentCollider(
    createVector(20, 420),
    createVector(700, 400)
  ); */

  SEGMENTMANAGER.addLiveLight(8000, createVector(500, 500), 2000);

  //Adding borders
  /* SEGMENTMANAGER.addSegmentCollider(createVector(0, 0), createVector(0, width));
  SEGMENTMANAGER.addSegmentCollider(createVector(0, 0), createVector(width, 0));
  SEGMENTMANAGER.addSegmentCollider(
    createVector(width, 0),
    createVector(width, width)
  );
  SEGMENTMANAGER.addSegmentCollider(
    createVector(0, width),
    createVector(width, width)
  ); */

  /*   SEGMENTMANAGER.addCircleCollider(createVector(100, 100), 100); */
  /* SEGMENTMANAGER.addCircleCollider(createVector(40, 200), 20); */
  SEGMENTMANAGER.addCircleCollider(createVector(400, 400), 400);
  SEGMENTMANAGER.addCircleCollider(createVector(400, 400), 200);
  SEGMENTMANAGER.addCircleCollider(createVector(340, 430), 60);
  SEGMENTMANAGER.addCircleCollider(createVector(40, 430), 60);
  SEGMENTMANAGER.addCircleCollider(createVector(600, 200), 60);
  SEGMENTMANAGER.addCircleCollider(createVector(460, 450), 80);
  /*  SEGMENTMANAGER.addCircleCollider(createVector(400, 350), 80); */

  for (let i = 0; i < 10; i++) {
    let center = createVector(random(0, width), random(0, width));
    let centerL = createVector(random(0, width), random(0, width));
    let offSet = createVector(random(0, width / 10), random(0, width / 10));
    let r = abs(randomGaussian(10, 100));

    SEGMENTMANAGER.addCircleCollider(center, r);
    /*  SEGMENTMANAGER.addLight(4000, center.add(offSet), 2000); */
    /*  SEGMENTMANAGER.addLiveLight(4000, centerL, 2000); */
    /* SEGMENTMANAGER.addSegmentCollider(
      createVector(random(0, width), random(0, width)),
      createVector(random(0, width), random(0, width))
    ); */
  }

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
  background(0, 255);

  /* frameRate(1); */

  /*  firstRay.compute(); */

  SEGMENTMANAGER.compute(); //do not compute every ray when in recursive mode
  blendMode(ADD);
  SEGMENTMANAGER.draw();
  SEGMENTMANAGER.cleanReflections();
  blendMode(BLEND);
  console.log(frameRate());
}
