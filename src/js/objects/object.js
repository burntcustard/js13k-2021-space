export default function GameObject(props) {
  this.w = props.w ?? 1;
  this.h = props.h ?? 1;
  this.d = props.d ?? 1;
  this.x = props.x ?? 0;
  this.y = props.y ?? 0;
  this.z = props.z ?? 0;
  this.rx = props.rx ?? 0;
  this.ry = props.ry ?? 0;
  this.rz = props.rz ?? 0;
}

/**
 * Update a game object to change it's position, recalculate lighting, etc.
 * @param  {[type]} elapsed               [description]
 * @param  {[type]} lights                [description]
 */
GameObject.prototype.update = function (elapsed, lights) {
  this.model.update(elapsed, lights);
};

/**
 * Add the shape to the gameworld by appending it's element to the DOM
 */
GameObject.prototype.spawn = function () {
  this.model.spawn();
  this.update();
};
