let depthLimit = 200;

class Segment {
  constructor(start, end, MANAGER) {
    this.start = start.copy();
    this.end = end.copy();

    this.MANAGER = MANAGER;
  }

  draw() {
    this.colorToStroke([255, 255, 0], 2);

    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }

  colorToStroke(color, width) {
    strokeWeight(width);
    stroke(color[0], color[1], color[2]);
  }
}

class Ray extends Segment {
  constructor(start, end, MANAGER, rayDepth = 0) {
    super(start, end, MANAGER);
    this.rayDepth = rayDepth;
    this.spawnedChildRay = false;

    this.isColliding = false;
    this.collisionObject = null;
  }

  compute() {
    if (!this.spawnedChildRay) {
      this.isColliding = false;
      this.collisionObject = null;

      let collisionObject = Physics.rayCast(this);

      if (collisionObject) {
        this.isColliding = true;
        this.collisionObject = collisionObject;

        if (this.rayDepth == 0) this.reflectRecursive();
      }
    }
  }

  draw() {
    if (this.isColliding) {
      this.drawRay();

      /*  this.drawNormal();
      this.drawReflection(); */
    } else {
      this.colorToStroke([255, 0, 255], 2);

      line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
  }

  drawRay() {
    let tint = map(this.rayDepth, 0, this.MANAGER.depthLimit, 0, 255);
    this.colorToStroke([255 - tint, 255 - tint, 255 - tint], 2);

    line(
      this.start.x,
      this.start.y,
      this.collisionObject.position.x,
      this.collisionObject.position.y
    );
  }

  drawNormal() {
    this.colorToStroke([255, 0, 255], 1);
    line(
      this.collisionObject.position.x,
      this.collisionObject.position.y,
      this.collisionObject.normalOnContact.x,
      this.collisionObject.normalOnContact.y
    );
  }
  drawReflection() {
    this.colorToStroke([255, 0, 0], 1);
    line(
      this.collisionObject.position.x,
      this.collisionObject.position.y,
      this.collisionObject.reflectionOnContact.x,
      this.collisionObject.reflectionOnContact.y
    );
  }
  changeLength(mult) {
    let rayOnOrigin = p5.Vector.sub(this.end, this.start);
    rayOnOrigin.mult(mult);
    this.end = p5.Vector.add(this.start, rayOnOrigin);
  }
  length() {
    let rayOnOrigin = p5.Vector.dist(this.end, this.collisionObject.position);
    return rayOnOrigin;
  }

  reflect(recursive = false) {
    //ADDING CHILD RAY

    let positionCorrected = p5.Vector.add(
      this.collisionObject.position,
      this.collisionObject.normal
    );
    let ray = new Ray(
      positionCorrected,
      this.collisionObject.reflectionOnContact,
      this.MANAGER,
      this.rayDepth + 1
    );

    this.MANAGER.RAYS.push(ray);

    if (!recursive) this.spawnedChildRay = true;

    return ray;
  }

  reflectRecursive() {
    if (this.rayDepth < this.MANAGER.depthLimit) {
      if (this.collisionObject) {
        let ray = this.reflect(true);

        ray.compute();
        ray.reflectRecursive();
      }
    }
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
  constructor(depthLimit = 50) {
    this.COLLIDERS = new Array();
    this.RAYS = new Array();
    this.depthLimit = depthLimit;
  }

  initialize() {}

  addLiveRay(start, end) {
    let ray = new LiveRay(start, end, this);
    this.RAYS.push(ray);
    return ray;
  }
  addRay(start, end) {
    let ray = new Ray(start, end, this);
    this.RAYS.push(ray);
    return ray;
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
    console.log(this.RAYS.length);
  }

  cleanReflections() {
    this.RAYS = this.RAYS.filter((segment) => {
      return segment.rayDepth == 0;
    });
    this.COLLIDERS = this.COLLIDERS.filter((segment) => {
      if (!segment.rayDepth) return true;
      return segment.rayDepth == 0;
    });
  }
}
