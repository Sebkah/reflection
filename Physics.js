class Physics {
  static colliders;

  static rayCast(ray) {
    let collider = null;
    let position = null;

    let minDist = Infinity;
    /*   console.log(this.colliders); */

    for (const currentCollider of this.colliders) {
      /*   console.log(currentCollider); */
      let collisionPoint = currentCollider.findIntersection(ray);

      if (collisionPoint) {
        let distance = this.distance(collisionPoint, ray.start);

        if (distance < minDist) {
          minDist = distance;
          position = collisionPoint;
          collider = currentCollider;
        }
      }
    }

    if (collider) {
      let collisionObject = new CollisionObject(ray, collider, position);
      collisionObject.calculateNormal();
      collisionObject.calculateReflection();

      return collisionObject;
    }

    return null;
  }

  static distance(a, b) {
    return p5.Vector.dist(a, b);
    return p5.Vector.sub(a, b).magSq();
  }

  static crossP(v, w) {
    let cross = v.x * w.y - v.y * w.x;
    return cross;
  }
}

class CollisionObject {
  constructor(ray, collider, position) {
    this.position = position;
    this.ray = ray;
    this.collider = collider;

    this.normal = null;
    this.normalOnContact = null;

    this.reflection = null;
    this.reflectionOnContact = null;
  }

  calculateNormal() {
    /*     console.log(this.ray, this.position); */
    this.normal = this.collider.calculateNormal(this.ray, this.position);
    /* this.normalOnContact = p5.Vector.add(
      p5.Vector.mult(this.normal, 15),
      this.position
    ); */
  }

  calculateReflection() {
    this.reflection = this.collider.calculateReflection(this.ray, this.normal);

    this.reflectionOnContact = p5.Vector.add(
      this.position,
      p5.Vector.mult(this.reflection, 1500)
    );
  }
}

class Collider {
  constructor() {}

  findIntersection() {}
  calculateNormal() {}
  calculateReflection() {}
  draw() {}
}

class SegmentCollider extends Collider {
  constructor(start, end, MANAGER) {
    super();
    this.start = start;
    this.end = end;

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

  findIntersection(ray) {
    let p = this.start;
    let q = ray.start;

    let r = p5.Vector.sub(this.end, p);
    let s = p5.Vector.sub(ray.end, q);

    let t = this.crossP(p5.Vector.sub(q, p), s) / this.crossP(r, s);
    let u = this.crossP(p5.Vector.sub(q, p), r) / this.crossP(r, s);

    if (this.crossP(r, s) != 0 && 0 < u && u <= 1 && t > 0 && t <= 1) {
      let collisionPoint = p5.Vector.add(p, p5.Vector.mult(r, t));
      /*       console.log('segment collision'); */
      return collisionPoint;
    } else {
      /* console.log('no segment collision'); */
      return null;
    }
  }

  calculateNormal(ray) {
    let v = this.start;
    let w = this.end;
    let p = ray.start;

    let l = pow(p5.Vector.dist(v, w), 2);

    let t = p5.Vector.dot(p5.Vector.sub(p, v), p5.Vector.sub(w, v)) / l;
    let projection = p5.Vector.add(v, p5.Vector.mult(p5.Vector.sub(w, v), t));

    let normal = p5.Vector.sub(p, projection);
    normal.normalize();

    return normal;
  }

  calculateReflection(ray, normal) {
    let d = p5.Vector.sub(ray.end, ray.start);
    let n = normal;
    let r = p5.Vector.sub(d, p5.Vector.mult(n, p5.Vector.dot(d, n) * 2));
    r.normalize();

    return r;
  }

  crossP(v, w) {
    let cross = v.x * w.y - v.y * w.x;
    return cross;
  }
}
class CircleCollider extends Collider {
  constructor(center, radius, MANAGER) {
    super();
    this.center = center;
    this.radius = radius;

    this.MANAGER = MANAGER;
  }

  draw() {
    this.colorToStroke([255, 255, 0], 2);
    noFill();

    circle(this.center.x, this.center.y, this.radius * 2);
  }

  colorToStroke(color, width) {
    strokeWeight(width);
    stroke(color[0], color[1], color[2]);
  }

  findIntersection(ray) {
    //https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm

    let d = p5.Vector.sub(ray.end, ray.start);
    let f = p5.Vector.sub(ray.start, this.center);
    let r = this.radius;

    let a = d.dot(d);
    let b = 2 * f.dot(d);
    let c = f.dot(f) - r * r;

    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      /* console.log('no collision'); */
      return null;
    } else {
      // ray didn't totally miss sphere,
      // so there is a solution to
      // the equation.

      discriminant = sqrt(discriminant);

      // either solution may be on or off the ray so need to test both
      // t1 is always the smaller value, because BOTH discriminant and
      // a are nonnegative.
      let t1 = (-b - discriminant) / (2 * a);
      let t2 = (-b + discriminant) / (2 * a);

      // 3x HIT cases:
      //          -o->             --|-->  |            |  --|->
      // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit),

      // 3x MISS cases:
      //       ->  o                     o ->              | -> |
      // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

      if (t1 >= 0 && t1 <= 1) {
        // t1 is the intersection, and it's closer than t2
        // (since t1 uses -b - discriminant)
        // Impale, Poke
        /*     console.log('collision', t1); */
        return p5.Vector.add(p5.Vector.mult(d, t1), ray.start);
      }

      // here t1 didn't intersect so we are either started
      // inside the sphere or completely past it
      if (t2 >= 0 && t2 <= 1) {
        // ExitWound
        return p5.Vector.add(p5.Vector.mult(d, t2), ray.start);
      }

      // no intn: FallShort, Past, CompletelyInside
      return null;
    }
  }

  calculateNormal(ray, collisionPoint) {
    let int = 1;
    if (p5.Vector.dist(ray.start, this.center) < this.radius) int = -1;
    let normal = p5.Vector.sub(collisionPoint, this.center).normalize();
    normal.mult(int);
    return normal;
  }

  calculateReflection(ray, normal) {
    let d = p5.Vector.sub(ray.end, ray.start);
    let n = normal;
    let r = p5.Vector.sub(d, p5.Vector.mult(n, p5.Vector.dot(d, n) * 2));
    r.normalize();

    return r;
  }

  crossP(v, w) {
    let cross = v.x * w.y - v.y * w.x;
    return cross;
  }
}
