import GameObject from '../objects/object';
import ShipController from '../ship-controller';
import { PI_2 } from '../util';
import Vec3 from '../vec3';

export default function Ship({ x, y, z, parent }) {
  GameObject.call(this, { x, y, z });
  this.id = Ship.prototype.count++;
  this.status = 'ready';
  this.timer = 0;
  this.power = 30;
  this.bay = null;
  this.speed = 0;
  this.acceleration = 0.01;

  // Docking got moved to the constructor and just puts the ship in bay 0 for now.
  // It was done/is by the shipcontroller before, so... I might have broken things.
  this.dock(parent.bays[0]);

  // TODO: Have a set amount that each ship can carry, allow for better ships
  // with a bigger cargo hold?

  ShipController.ships.push(this);
}

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.count = 0;

Ship.prototype.moveToDestination = function () {
  const current = new Vec3(this.x, this.y, this.z);
  const destination = new Vec3(this.destination.x, this.destination.y, this.destination.z);

  if (current.distanceTo(destination) < 1) {
    // At destination
    this.destination = null;
    this.model.element.classList.remove('thrust');
    // TODO: Turn ship engine lights off?
    return;
  }

  this.model.element.classList.add('thrust');

  const toDestination = destination.minus(current);
  const change = toDestination.resize(1); // TODO: Make speed not constant (acceleration?)
  this.x += change.x;
  this.y += change.y;
  this.z += change.z;

  // Was having issues trying to have rx too so left just rz
  // TODO: Rotate the ship model?
  this.rz = toDestination.rotationZ() + PI_2;
};

Ship.prototype.update = function (elapsed, lights) {
  GameObject.prototype.update.call(this, elapsed, lights);

  if (this.destination) {
    this.moveToDestination();
  }
};

Ship.prototype.dock = function (bay) {
  bay.ship = this;
  this.bay = bay;
};

Ship.prototype.undock = function () {
  if (this.bay) {
    // Take off and fly towards arrival point
    this.destination = {
      x: this.bay.hangar.arrivalPoint.x,
      y: this.bay.hangar.arrivalPoint.y,
      z: this.bay.hangar.arrivalPoint.z,
    };
    this.bay.ship = null;
    this.bay = null;
  }
};
