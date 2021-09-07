import Module from './module';
import BoxVisibleInner from '../shapes/box-visible-inner';
import resources from '../resources';
import { $, lerp } from '../util';
import Ship from '../ships/ship';
import MiningShip from '../ships/mining-ship';
import ShipController from '../ship-controller';

const MIN_MINING_TIME = 10000;
const MAX_MINING_TIME = 30000;
const SHIP_POWER_PER_S = 1;
const SHIP_CHARGE_PER_S = 2;
const SHIP_POWER_CAPACITY = (MAX_MINING_TIME / 1000) * SHIP_POWER_PER_S;

const info = {
  tag: 'Hangar',
  desc: 'Spawns ships which gather metal',
  className: 'hangar module',
  cost: 35,
  power: -10,
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

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Hangar, info);
Hangar.prototype = Object.create(Module.prototype);
Hangar.prototype.constructor = Hangar;

Hangar.prototype.build = function () {
  Module.prototype.build.call(this);

  for (let i = 0; i < info.numberOfBays; i++) {
    const bay = {
      hangar: this,
      ship: null,
    };
    this.bays.push(bay);
    ShipController.ships.push(new MiningShip({
      x: this.x,
      y: this.y,
      z: this.z,
      id: i, // TODO: This ID should be unique, just use UUID?
      bay,
    }));
  }

  ShipController.hangars.push(this);
  ShipController.bays.push(...this.bays);
};

Hangar.prototype.update = function (elapsed, lights) {
  Module.prototype.update.call(this, elapsed, lights);

  this.bays.forEach(({ ship }) => {
    if (ship) {
      switch (ship.status) {
        case 'docked':
          // Offload mats and start charging
          resources.mats.current = Math.min(resources.mats.current + 50, resources.mats.capacity);
          this.power -= SHIP_CHARGE_PER_S;
          if (this.active) resources.power.use += SHIP_CHARGE_PER_S;
          ship.status = 'charging';
          break;
        case 'charging':
          if (this.active) {
            // Charge ship until fully charged
            ship.power = Math.min(
              ship.power + SHIP_CHARGE_PER_S * (elapsed / 1000),
              SHIP_POWER_CAPACITY,
            );
            if (ship.power === SHIP_POWER_CAPACITY) {
              ship.status = 'ready';
              this.power += SHIP_CHARGE_PER_S;
              resources.power.use -= SHIP_CHARGE_PER_S;
            }
          }
          break;
        default:
        // Unknown status, do nothing
      }
    }
  });
};

Hangar.prototype.kill = function () {
  ShipController.hangars = ShipController.hangars.filter((hangar) => hangar !== this);
  ShipController.bays = ShipController.bays.filter((bay) => !this.bays.includes(bay));
  Module.prototype.kill.call(this);
};
