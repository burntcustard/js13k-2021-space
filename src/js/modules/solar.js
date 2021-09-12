import Module from './module';
import GameObject from '../objects/object';
import Box from '../shapes/box';
import Vec3 from '../vec3';
import { $ } from '../util';
import gameObjectList from '../game-object-list';
import resources from '../resources';

const info = {
  tag: 'Solar Panel Basic',
  desc: 'Generates power',
  className: 'solar module',
  cost: 30,
  power: 20,
  unlock: () => gameObjectList.length > 1,
  unlockText: 'Build a block',
  unlockUpgrade: [
    () => resources.population.current > 4,
    () => resources.population.current > 14,
  ],
  unlockUpgradeText: [
    'Reach 5 population',
    'Reach 15 population',
  ],
  w: 108,
  h: 2,
  d: 52,
};

export default function Solar({
  x, y, z, rx, ry, rz,
}) {
  this.model = new Box({
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
  this.model.sides[1].element.className += ' panel';
  this.model.sides[4].element.className += ' panel';
  this.level = 0;
  this.maxLevel = 2;
  this.upgradeCost = 10;
  this.info = info;

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Solar, info);
Solar.prototype = Object.create(Module.prototype);
Solar.prototype.constructor = Solar;

Solar.prototype.instancesBuilt = 0;

Solar.prototype.upgrade = function () {
  this.setLevel(this.level + 1);
  resources.solarHasBeenUpgraded = true; // TODO: Move this variable to somewhere more sensible?
};

Solar.prototype.setLevel = function (level) {
  // Disable the re-enable to update resource bar numbers
  this.disable();

  // TODO: Maybe save space by not changling className
  this.model.element.classList.remove(`lvl-${this.level}`);
  this.level = level;
  this.model.element.classList.add(`lvl-${this.level}`);

  this.power = info.power * (this.level + 1);
  // TODO: Do we want to add some time while upgrading before re-enabling?
  this.enable();
  this.model.changeSize({ w: info.w * (this.level + 1) });

  const shape = this.connectedTo.parent;

  // Side rotated with shape's rotation
  const sideRotated = new Vec3(this.connectedTo.x, this.connectedTo.y, this.connectedTo.z)
    .rotateX(shape.rx)
    .rotateY(shape.ry)
    .rotateZ(shape.rz);

  // Half model width in direction of side
  const sideResized = sideRotated.resize(this.model.w * 0.5);

  this.x = shape.x + sideRotated.x + sideResized.x;
  this.y = shape.y + sideRotated.y + sideResized.y;
  this.z = shape.z + sideRotated.z + sideResized.z;

  if (this.selected) {
    $('.ui-panel__build-info').innerHTML = GameObject.prototype.createSelectedObjectHTML.call(this);
  }
};

Solar.prototype.build = function () {
  Module.prototype.build.call(this);
  Solar.prototype.instancesBuilt++;
};
