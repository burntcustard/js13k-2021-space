import GameObject from '../objects/object';
import ShipController from '../ship-controller';

export default function Ship({ x, y, z, parent }) {
  GameObject.call(this, { x, y, z });
  this.id = Ship.prototype.count++;
  this.status = 'ready';
  this.timer = 0;
  this.power = 30;
  this.bay = null;

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

Ship.prototype.spawn = function () {
  GameObject.prototype.spawn.call(this);

  if (this.bay) {
    this.undock();
  }
};

Ship.prototype.rotateToDestination = function (rotationToDestination) {
  // Rotate just a little
};

Ship.prototype.moveForwards = function () {
  this.x += this.speed;
  this.y += this.speed;
  this.z += this.speed;
};

Ship.prototype.moveToDestination = function () {
  const alreadyAtDestination = (
    this.destination.x !== this.x
    && this.destination.y !== this.y
    && this.destination.z !== this.z
  );

  if (alreadyAtDestination) {
    this.destination = null;
    // TODO: Turn ship engine lights off?
    return;
  }

  // TODO: Figure out distance between the ship and it's destination
  const distanceToDestination = 1000;

  // TODO: Figure out rotation between this ship and the destination x/y/z
  const rotationToDestination = {
    rx: 0,
    ry: 0,
    rz: 0,
  };

  const facingDestination = (
    rotationToDestination.x === 0
    && rotationToDestination.y === 0
    && rotationToDestination.z === 0
  );

  // TODO: How far should the ship be before decelerating?
  // TODO: Create this.brakeDistance per ship, or just for all?
  const brakeDistance = 100;

  if (!facingDestination) {
    // Rotate a little towards the destination
    this.rotateToDestination(rotationToDestination);
    // Change velocity up to max-speed-while-turning
  }

  if (distanceToDestination > brakeDistance) {
    // TODO: Accelerate to max-speed? (Or max-speed-while-turning)
    this.speed += this.acceleration; // * elapsed(?)
    this.moveForwards();
    return;
  }

  if (distanceToDestination < brakeDistance) {
    this.speed -= this.acceleration;
    this.moveForwards();
    // TODO: Decelerate to... 0? When you get there?
    return; // Currently useless because nothing after it
  }
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
  // Take off and fly forwards a bit
  this.destination = {
    x: this.bay.x + 20,
    y: this.bay.y,
    z: this.bay.z,
  };

  // Unset bay
  if (this.bay) {
    this.bay.ship = null;
    this.bay = null;
  }
};
