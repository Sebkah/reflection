class Light {
  constructor(numberOfRays, center, radius, segmentManager) {
    this.segmentManager = segmentManager;
    this.center = center;
    this.radius = radius;
    this.numberOfRays = numberOfRays;
    this.RAYS = this.initialize();
  }

  initialize() {
    let RAYS = new Array();

    for (let i = 0; i < this.numberOfRays; i++) {
      RAYS.push(
        this.segmentManager.addRay(
          this.center,
          p5.Vector.add(
            this.center,
            createVector(
              cos((360 / this.numberOfRays) * i) * this.radius,
              sin((360 / this.numberOfRays) * i) * this.radius
            )
          )
        )
      );
    }

    return RAYS;
  }

  compute() {
    this.center.x = mouseX;
    this.center.y = mouseY;

    this.RAYS.forEach((segment, index) => {
      segment.start = this.center;
      segment.end = p5.Vector.add(
        this.center,
        createVector(
          cos((360 / this.numberOfRays) * index) * this.radius,
          sin((360 / this.numberOfRays) * index) * this.radius
        )
      );
    });
  }
}
