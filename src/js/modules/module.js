import GameObject from '../objects/object';
import resources from '../resources';

export default function Module(props) {
  GameObject.call(this, props);
  this.tag = props.tag;
  this.desc = props.desc ?? '';
  this.cost = props.cost;
  this.power = props.power ?? 0;

  // TODO: Add event listener for clicking to interact with module
  // TODO: Add even listener for hovering about to build thing on faces(?)
}

// Set Module prototype to an instance of a GameObject
Module.prototype = Object.create(GameObject.prototype);
// Set Module contructor
Module.prototype.constructor = Module;

Module.prototype.update = function (elapsed, lights) {
  GameObject.prototype.update.call(this, elapsed, lights);

  if (this.active) {
    this.updatePower(elapsed);
  }

  if (this.restartTimer) {
    this.restartTimer = Math.max(this.restartTimer - elapsed, 0);

    if (this.restartTimer === 0) {
      this.enable();
    }
  }
};

Module.prototype.updatePower = function (elapsed) {
  if (this.power < 0) {
    // Grab some power from the resources banks
    resources.power.current = Math.max(
      resources.power.current + this.power * (elapsed / 1000),
      0,
    );

    // You used all the power and now this module is shutting down!
    if (resources.power.current === 0) {
      this.shutdown();
    }
  }

  if (this.power > 0) {
    // Add some power from the resources banks
    resources.power.current = Math.min(
      resources.power.current + this.power * (elapsed / 1000),
      resources.power.capacity,
    );
  }
};

Module.prototype.disable = function () {
  this.active = false;
  resources.power.use += this.power < 0 ? this.power : 0;
  resources.power.gen -= this.power > 0 ? this.power : 0;
};

Module.prototype.enable = function () {
  this.active = true;
  resources.power.use -= this.power < 0 ? this.power : 0;
  resources.power.gen += this.power > 0 ? this.power : 0;
};

/**
 * Shutdown this module, but try to restart it automatically after 3s
 * @return {[type]} [description]
 */
Module.prototype.shutdown = function () {
  this.disable();
  this.restartTimer = 3000;
};
