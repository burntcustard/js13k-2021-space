import Module from './module';
import BoxVisibleInner from '../shapes/box-visible-inner';
import MiningShip from '../ships/mining-ship';
import ShipController from '../ship-controller';
import Vec3 from '../vec3';
import achievements from '../achievements';

const info = {
  tag: 'Hangar',
  desc: 'Creates ships to gather resources',
  className: 'hangar module',
  cost: 30,
  power: -10,
  unlock: () => achievements.population > 2,
  unlockText: 'Reach 3 population',
  w: 90,
  h: 84,
  d: 120,
  numberOfBays: 2,
};

export default function Hangar({ x, y, z, rx, ry, rz }) {
  this.model = new BoxVisibleInner({
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
    wallThickness: 4,
    middleWallOffset: 8,
  });

  this.model.sides[2].element.className += ' door';
  this.model.update();

  this.bays = [];
  this.buildList = [MiningShip];

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Hangar, info);
Hangar.prototype = Object.create(Module.prototype);
Hangar.prototype.constructor = Hangar;

Hangar.prototype.build = function () {
  Module.prototype.build.call(this);

  this.facing = new Vec3(1, 0, 0).rotate(this.rx, this.ry, this.rz);
  this.arrivalPoint = this.facing.resize(200).add(new Vec3(this.x, this.y, this.z));

  for (let i = 0; i < info.numberOfBays; i++) {
    const bay = {
      hangar: this,
      ship: null,
    };
    this.bays.push(bay);
  }

  ShipController.hangars.push(this);
  ShipController.bays.push(...this.bays);
};

Hangar.prototype.kill = function () {
  ShipController.hangars = ShipController.hangars.filter((hangar) => hangar !== this);
  ShipController.bays = ShipController.bays.filter((bay) => !this.bays.includes(bay));
  Module.prototype.kill.call(this);
};
