import Module from './module';
import Box from '../shapes/box';
import resources from '../resources';
import { lerp } from '../util';

const MIN_MINING_TIME = 10000;
const MAX_MINING_TIME = 30000;
const SHIP_POWER_PER_S = 1;
const SHIP_CHARGE_PER_S = 2;
const SHIP_POWER_CAPACITY = (MAX_MINING_TIME / 1000) * SHIP_POWER_PER_S;

const info = {
  tag: 'Hangar',
  desc: 'Spawns ships which gather metal',
  className: 'hangar',
  cost: 35,
  power: -10,
  w: 60,
  h: 60,
  d: 60,
};

export default function Hangar({ x, y, z, rx, ry, rz }) {
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

  this.model.sides[2].element.className += ' door';

  this.ships = [];
  for (let i = 0; i < 1; i++) {
    this.ships.push({
      id: i,
      status: 'ready',
      timer: 0,
      power: SHIP_POWER_CAPACITY,
    });
  }

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Hangar, info);
Hangar.prototype = Object.create(Module.prototype);
Hangar.prototype.constructor = Hangar;

Hangar.prototype.build = function () {
  Module.prototype.build.call(this);
};

Hangar.prototype.update = function (elapsed, lights) {
  Module.prototype.update.call(this, elapsed, lights);

  this.ships.forEach((ship) => {
    switch (ship.status) {
      case 'ready':
        // If ship ready, hangar active and space for metal send out for random time
        if (this.active && resources.mats.current < resources.mats.capacity) {
          ship.status = 'mining';
          ship.timer = lerp(MIN_MINING_TIME, MAX_MINING_TIME, Math.random());
        }
        break;
      case 'mining':
        // Once timer is depleted return to base
        ship.timer = Math.max(ship.timer - elapsed, 0);
        ship.power = Math.max(
          ship.power - SHIP_POWER_PER_S * (elapsed / 1000),
          0,
        );
        if (ship.timer === 0) {
          ship.status = 'return';
        }
        break;
      case 'return':
        // When ship returns add metal to count
        resources.mats.current = Math.min(resources.mats.current + 50, resources.mats.capacity);
        ship.status = 'charging';
        // TODO: This should update the power consumption
        this.power -= SHIP_CHARGE_PER_S;
        break;
      case 'charging':
        if (this.active) {
          // Charge ship up based on time out, ready again when charged
          ship.power = Math.min(
            ship.power + SHIP_CHARGE_PER_S * (elapsed / 1000),
            SHIP_POWER_CAPACITY,
          );
          if (ship.power === SHIP_POWER_CAPACITY) {
            ship.status = 'ready';
            this.power += SHIP_CHARGE_PER_S;
          }
        }
        break;
      default:
      // Unknown status, do nothing
    }
    console.log(ship);
  });
};
