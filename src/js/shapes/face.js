import Vec3 from '../vec3';

export default function Face({ w, h, x, y, z, rx, ry, rz, colour, className, parent }) {
  this.w = w;
  this.h = h;
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.rz = rz ?? 0;
  this.ry = ry ?? 0;
  this.rx = rx ?? 0;
  this.lightness = 0.5;
  this.colour = colour ?? new Vec3(1, 0, 0);
  this.element = document.createElement('div');
  this.element.className = `face ${className ?? 'rect'}`;
  this.parent = parent;
  this.setSize();
  this.update();
  // this.element.innerHTML = 'FACE';
}

Face.prototype.setSize = function () {
  this.element.style.width = `${this.w}px`;
  this.element.style.height = `${this.h}px`;
};

Face.prototype.updateTransform = function () {
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

Face.prototype.updateLighting = function (lights, ms) {
  const fsx = Math.sin(this.rx);
  const fsy = Math.sin(this.ry);
  const fsz = Math.sin(this.rz);
  const fcx = Math.cos(this.rx);
  const fcy = Math.cos(this.ry);
  const fcz = Math.cos(this.rz);

  const mf = [
    fcx * fsy * fcz + fsx * fsz,
    fcx * fsy * fsz - fsx * fcz,
    fcx * fcy,
  ];

  const normal = new Vec3(
    ms[0][0] * mf[0] + ms[0][1] * mf[1] + ms[0][2] * mf[2],
    ms[1][0] * mf[0] + ms[1][1] * mf[1] + ms[1][2] * mf[2],
    ms[2][0] * mf[0] + ms[2][1] * mf[1] + ms[2][2] * mf[2],
  ).normalise();

  // Start with base level of ambient lighting
  let lightness = 0.2;

  // https://cglearn.codelight.eu/pub/computer-graphics/shading-and-lighting#material-lambert-lighting-model-1
  // When vectors are noralised the cosine between them is just a dot b
  // The cosine is 1 at 0deg separation and 0 at 90deg
  // We only care about the cosine between 1 and 0
  // Multiplying by some factor so it doesn't blow out to just white
  lights.forEach((light) => {
    lightness += Math.max(normal.dot(light.direction), 0) * light.intensity;
  });

  // const colour = this.colour.multiply(this.lightness * 255);
  // this.element.style.filter = `brightness(${this.lightness})`;
  this.element.style.setProperty('--l', lightness);
  // this.element.style.background = `rgb(${colour.x}, ${colour.y}, ${colour.z})`;
  // this.element.style.boxShadow = `0 0 9px rgba(255,255,255,${this.lightness - 0.5})`;
};

Face.prototype.update = function () {
  this.updateTransform();
};
