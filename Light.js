class Light {
  constructor(numberOfRays, center, radius, live = false, segmentManager) {
    this.segmentManager = segmentManager;
    this.center = center;
    this.radius = radius;
    this.live = live;
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
    if (this.live) {
      /*   this.center.x += sin(frameCount * 2) * 4;
      this.center.y += cos(frameCount * 2) * 4; */
      this.center.x = mouseX; /*  */
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
}
