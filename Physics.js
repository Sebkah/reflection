class Physics {
  static colliders;

  static rayCast(ray) {
    let collider = null;
    let position = null;

    let minDist = Infinity;
    /*   console.log(this.colliders); */

    for (const currentCollider of this.colliders) {
      /*   console.log(currentCollider); */
      let collisionPoint = this.findIntersection(currentCollider, ray);

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
      /*       console.log(collisionObject); */
      return collisionObject;
    } else {
      console.log('no collision');
    }

    return null;
  }

  static findIntersection(collider, ray) {
    let p = collider.start.copy();
    let q = ray.start.copy();

    let r = p5.Vector.sub(collider.end, p);
    let s = p5.Vector.sub(ray.end, q);

    let t = this.crossP(p5.Vector.sub(q, p), s) / this.crossP(r, s);
    let u = this.crossP(p5.Vector.sub(q, p), r) / this.crossP(r, s);

    if (this.crossP(r, s) != 0 && 0 < u && u <= 1 && t > 0 && t <= 1) {
      let collisionPoint = p5.Vector.add(p, p5.Vector.mult(r, t));
      return collisionPoint;
    } else {
      return null;
    }
  }

  static distance(a, b) {
    return p5.Vector.dist(a, b);
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
    this.reflectionOnContact = null;
  }

  calculateNormal() {
    let v = this.collider.start;
    let w = this.collider.end;
    let p = this.ray.start;

    let l = pow(p5.Vector.dist(v, w), 2);

    let t = p5.Vector.dot(p5.Vector.sub(p, v), p5.Vector.sub(w, v)) / l;
    let projection = p5.Vector.add(v, p5.Vector.mult(p5.Vector.sub(w, v), t));

    let normal = p5.Vector.sub(p, projection);
    normal.normalize();

    this.normal = normal;

    this.normalOnContact = p5.Vector.add(
      p5.Vector.mult(normal, 15),
      this.position
    );
  }

  calculateReflection() {
    let d = p5.Vector.sub(this.ray.end, this.ray.start);
    let n = this.normal;
    let r = p5.Vector.sub(d, p5.Vector.mult(n, p5.Vector.dot(d, n) * 2));
    r.normalize();

    this.reflectionOnContact = p5.Vector.add(
      this.position,
      p5.Vector.mult(r, 1500)
    );
  }
}
