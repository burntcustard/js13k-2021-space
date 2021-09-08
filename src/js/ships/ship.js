import GameObject from '../objects/object';

export default function Ship({ x, y, z, id, bay }) {
  GameObject.call(this, { x, y, z });
  this.id = id;
  this.status = 'ready';
  this.timer = 0;
  this.power = 30;
  this.bay = null;
  this.dock(bay);
  // TODO: Have a set amount that each ship can carry, allow for better ships
  // with a bigger cargo hold?
}

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.dock = function (bay) {
  bay.ship = this;
  this.bay = bay;
};

Ship.prototype.undock = function () {
  if (this.bay) {
    this.bay.ship = null;
    this.bay = null;
  }
};
