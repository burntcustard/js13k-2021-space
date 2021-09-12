import Module from './module';
import Octagon from '../shapes/octagon';
import Build from '../build';
import resources from '../resources';

const info = {
  tag: 'Energy Storage',
  desc: 'Increase power capacity by 500',
  className: 'store power module',
  cost: 20,
  unlock: () => resources.solarHasBeenUpgraded,
  unlockText: 'Upgrade a solar panel',
  w: 30,
  d: 30,
  h: 60,
};

export default function StorePower({
  x, y, z, rx, ry, rz,
}) {
  this.model = new Octagon({
    w: info.w,
    h: info.h,
    d: info.d,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    className: info.className,
  });

  Module.call(this, { x, y, z, rx, ry, rz, ...info });

  // Add buildableness to some sides
  this.model.sides.forEach((side, i) => {
    if (i !== 0 && i !== this.model.sides.length && i % 2 === 0) return;
    // TODO: Don't add buildableness to the side touching the existing shape side
    Build.addEventListenersTo(side);
  });

  this.indicator = document.createElement('div');
  this.indicator.className = 'indicator';
  this.model.sides[3].element.append(this.indicator); // Add to side opposite placement
}

Object.assign(StorePower, info);
StorePower.prototype = Object.create(Module.prototype);
StorePower.prototype.constructor = StorePower;

StorePower.prototype.update = function (elapsed, lights) {
  Module.prototype.update.call(this, elapsed, lights);
  this.indicator.style.setProperty(
    '--curr',
    `${Math.round((100 / resources.power.capacity) * resources.power.current)}%`,
  );
};

StorePower.prototype.build = function () {
  resources.power.capacity += 500;

  // TODO: StorePower build animation
  Module.prototype.build.call(this);
};

StorePower.prototype.kill = function () {
  resources.power.capacty -= 500;

  Module.prototype.kill.call(this);
};
