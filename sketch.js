let SEGMENTMANAGER;

function setup() {
  createCanvas(800, 800);

  SEGMENTMANAGER = new SegmentManager();
  SEGMENTMANAGER.addLiveRay(createVector(400, 200), createVector(800, 200));
  SEGMENTMANAGER.addLiveRay(createVector(0, 600), createVector(600, 100));

  SEGMENTMANAGER.addCollider(createVector(100, 100), createVector(700, 600));
  SEGMENTMANAGER.addCollider(createVector(0, 400), createVector(800, 400));

  SEGMENTMANAGER.addRay(createVector(700, 100), createVector(0, 600));
}

function draw() {
  background(220);

  SEGMENTMANAGER.compute();
  SEGMENTMANAGER.draw();
}
