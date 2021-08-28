export default function Shape({
  w, h, d, x, y, z, rx, ry, rz, className,
}) {
  this.w = w;
  this.h = h;
  this.d = d ?? w;
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.rx = rx ?? 0;
  this.ry = ry ?? 0;
  this.rz = rz ?? 0;
  this.element = document.createElement('div');
  this.element.className = `shape ${className}`;
}

Shape.prototype.spawn = function() {
  document.querySelector('.scene').append(this.element);
};

Shape.prototype.updateTransform = function() {
  const sinRx = Math.sin(this.rx);
  const sinRy = Math.sin(this.ry);
  const sinRz = Math.sin(this.rz);
  const cosRx = Math.cos(this.rx);
  const cosRy = Math.cos(this.ry);
  const cosRz = Math.cos(this.rz);

  this.element.style.transform = `
    translate3D(${this.x}px, ${this.y}px, ${this.z}px)
    matrix3d(
      ${cosRz * cosRy},
      ${sinRz * cosRy},
      ${-sinRy},
      0,
      ${cosRz * sinRy * sinRx - sinRz * cosRx},
      ${sinRz * sinRy * sinRx + cosRz * cosRx},
      ${cosRy * sinRx},
      0,
      ${cosRz * sinRy * cosRx + sinRz * sinRx},
      ${sinRz * sinRy * cosRx - cosRz * sinRx},
      ${cosRy * cosRx},
      0,
      0,
      0,
      0,
      1
    )
  `;
};

Shape.prototype.updateLighting = function(lights) {
  // Figure out surface normal from rotations
  // We have to do this for the shape rotation, then the face rotation
  // https://stackoverflow.com/a/27486532
  const sx = Math.sin(this.rx);
  const sy = Math.sin(this.ry);
  const sz = Math.sin(this.rz);
  const cx = Math.cos(this.rx);
  const xy = Math.cos(this.ry);
  const cz = Math.cos(this.rz);

  const ms = [
    [cz * xy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx],
    [sz * xy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx],
    [-sy, xy * sx, xy * cx],
  ];

  this.sides.forEach((side) => {
    side.updateLighting(lights, ms);
  });
};

Shape.prototype.update = function(lights) {
  this.updateTransform();
  if (lights && lights.length) {
    this.updateLighting(lights); // Maybe only do every few frames to save perf
  }
};
