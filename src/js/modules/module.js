import GameObject from '../objects/object';
import achievements from '../achievements';
import resources from '../resources';

export default function Module(props) {
  GameObject.call(this, props);
  this.tag = props.tag;
  this.desc = props.desc ?? '';
  this.cost = props.cost;
  this.mats = props.mats ?? 0;
  this.power = props.power ?? 0;
  this.population = props.population ?? 0;
  this.model.parent = this;
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

    if (!this.active && this.restartTimer === 0) {
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
    // Add some power to the resources banks
    resources.power.current = Math.min(
      resources.power.current + this.power * (elapsed / 1000),
      resources.power.capacity,
    );
  }

  if (this.mats > 0) {
    // Add some mats to the resources banks
    resources.mats.current = Math.min(
      resources.mats.current + this.mats * (elapsed / 1000),
      resources.mats.capacity,
    );
  }
};

Module.prototype.disable = function () {
  this.active = false;
  this.model.element.classList.add('disabled');
  resources.power.use += this.power < 0 ? this.power : 0;
  resources.power.gen -= this.power > 0 ? this.power : 0;
  resources.mats.gen -= this.mats > 0 ? this.mats : 0;
  resources.population.capacity -= this.population;
  if (this.selected) GameObject.prototype.updateBuildBarUI.call(this);
};

Module.prototype.enable = function () {
  this.active = true;
  this.model.element.classList.remove('disabled');
  resources.power.use -= this.power < 0 ? this.power : 0;
  resources.power.gen += this.power > 0 ? this.power : 0;
  resources.mats.gen += this.mats > 0 ? this.mats : 0;
  resources.population.capacity += this.population;
  if (this.selected) GameObject.prototype.updateBuildBarUI.call(this);
};

/**
 * Spawn the module into the gameworld. Modules spawn initially hidden,
 * and as "build frames" so that they can be positioned and built later.
 * @return {[type]} [description]
 */
Module.prototype.spawnFrame = function () {
  this.model.element.classList.add('frame');
  this.model.element.style.display = 'none';
  GameObject.prototype.spawn.call(this);
};

Module.prototype.spawn = function () {
  GameObject.prototype.spawn.call(this);
  GameObject.prototype.addSelectEventListeners.call(this);
};

/**
 * Build the module "for real", assuming it was previously a "build frame".
 * @return {[type]} [description]
 */
Module.prototype.build = function () {
  resources.mats.current -= this.cost;
  this.model.element.classList.remove('frame');
  this.model.element.style.display = ''; // Remove 'display: none'
  GameObject.prototype.addSelectEventListeners.call(this);
  this.enable();
};

/**
 * Shutdown this module, but try to restart it automatically after 3s
 * @return {[type]} [description]
 */
Module.prototype.shutdown = function () {
  this.disable();
  this.restartTimer = 3000;
};

Module.prototype.kill = function () {
  this.disable();
  achievements.modulesDeleted++;
  GameObject.prototype.kill.call(this);
};
