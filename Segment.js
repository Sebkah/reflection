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
    stroke(color[0], color[1], color[2], color[3]);
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

        if (this.MANAGER.recursive) {
          if (this.rayDepth == 0) this.reflectRecursive();
        } else {
          this.reflect();
        }
      }
    }
  }

  draw() {
    if (this.isColliding) {
      this.drawRay();

      /* this.drawNormal(); */
      /* this.drawReflection(); */
    } else {
      this.colorToStroke([255, 0, 255], 2);

      line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
  }

  drawRay() {
    let tint = map(this.rayDepth, 0, this.MANAGER.depthLimit, 0, 255);
    this.colorToStroke([255, 255, 255, 255 - tint], 0.05);

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
      p5.Vector.mult(this.collisionObject.normal, 0.001)
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
  constructor(depthLimit = 50, recursive = false, drawColliders = true) {
    this.COLLIDERS = new Array();
    this.RAYS = new Array();
    this.LIGHTS = new Array();

    this.depthLimit = depthLimit;
    this.recursive = recursive;

    this.drawColliders = drawColliders;
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

  addSegmentCollider(start, end) {
    let segment = new SegmentCollider(start, end, this);
    this.COLLIDERS.push(segment);

    return segment;
  }
  addCircleCollider(center, radius) {
    let circle = new CircleCollider(center, radius, this);
    this.COLLIDERS.push(circle);

    return circle;
  }

  addLight(numberOfRays, center, radius) {
    let light = new Light(numberOfRays, center, radius, this);
    this.LIGHTS.push(light);
    return light;
  }

  compute() {
    this.RAYS.forEach((ray) => {
      ray.compute();
    });
    this.LIGHTS.forEach((ray) => {
      ray.compute();
    });
  }

  draw() {
    this.RAYS.forEach((segment) => {
      segment.draw();
    });
    if (this.drawColliders) {
      this.COLLIDERS.forEach((segment) => {
        segment.draw();
      });
    }
    /* console.log(this.RAYS.length); */
  }

  cleanReflections() {
    if (this.recursive) {
      this.RAYS = this.RAYS.filter((segment) => {
        return segment.rayDepth == 0;
      });
    }
  }
}
