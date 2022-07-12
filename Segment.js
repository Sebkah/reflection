class Segment {
  constructor(start, end, MANAGER) {
    this.start = start.copy();
    this.end = end.copy();
    this.color = [255, 0, 0];
    this.MANAGER = MANAGER;
  }

  draw() {
    strokeWeight(1);
    stroke(this.color[0], this.color[1], this.color[2]);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

class Ray extends Segment {
  constructor(start, end, MANAGER, rayDepth) {
    super(start, end, MANAGER);
    this.initColor = [0, 255, 0];
    this.color = [0, 255, 0];

    this.rayDepth = rayDepth = 0;

    this.colliders = MANAGER.COLLIDERS;

    this.colliding = false;
    this.collisionPoint = null;
  }

  compute() {
    this.findClosestIntersection(this.colliders);
  }

  draw() {
    if (this.colliding) {
      this.color = [255, 255, 255];
      stroke(this.color[0], this.color[1], this.color[2]);
      strokeWeight(1);
      line(
        this.start.x,
        this.start.y,
        this.collisionPoint.x,
        this.collisionPoint.y
      );
      strokeWeight(10);
      point(this.collisionPoint.x, this.collisionPoint.y);
    } else {
      this.color = this.initColor;
      super.draw();
    }
  }

  findClosestIntersection(colliders) {
    let minDist = Infinity;
    this.colliding = false;

    colliders.forEach((collider) => {
      let collision = this.findIntersection(collider, this);
      if (collision) {
        let distance = p5.Vector.dist(collision.collisionPoint, this.start);
        if (distance < minDist) {
          this.collisionPoint = collision.collisionPoint;
          this.colliding = true;
          minDist = distance;
        }
      }
    });
  }

  findIntersection(segmentA, segmentB) {
    let p = segmentA.start.copy();
    let q = segmentB.start.copy();

    let r = p5.Vector.sub(segmentA.end, p);
    let s = p5.Vector.sub(segmentB.end, q);

    let t = this.crossP(p5.Vector.sub(q, p), s) / this.crossP(r, s);
    let u = this.crossP(p5.Vector.sub(q, p), r) / this.crossP(r, s);

    if (this.crossP(r, s) != 0 && 0 < u && u <= 1 && t > 0 && t <= 1) {
      let collisionPoint = p5.Vector.add(p, p5.Vector.mult(r, t));
      return {
        collisionPoint,
      };
    } else {
      return null;
    }
  }

  crossP(v, w) {
    let cross = v.x * w.y - v.y * w.x;
    return cross;
  }
}

class LiveRay extends Ray {
  constructor(start, end, MANAGER) {
    super(start, end, MANAGER);
  }

  draw() {
    this.end.x = mouseX;
    this.end.y = mouseY;
    super.draw();
  }
}

class SegmentManager {
  constructor() {
    this.COLLIDERS = new Array();
    this.RAYS = new Array();
  }

  initialize() {}

  addLiveRay(start, end) {
    this.RAYS.push(new LiveRay(start, end, this));
  }
  addRay(start, end) {
    this.RAYS.push(new Ray(start, end, this));
  }
  addCollider(start, end) {
    this.COLLIDERS.push(new Segment(start, end, this));
  }

  compute() {
    this.RAYS.forEach((segment) => {
      segment.compute();
    });
  }

  draw() {
    this.RAYS.forEach((segment) => {
      segment.draw();
    });
    this.COLLIDERS.forEach((segment) => {
      segment.draw();
    });
  }
}
