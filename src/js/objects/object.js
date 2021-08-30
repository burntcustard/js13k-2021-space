import camera from '../camera';

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

/**
 * Make this game object the selected one
 * @return {[type]} [description]
 */
GameObject.prototype.select = function () {
  this.selected = true;
  const element = document.createElement('div');
  element.className = 'selected';
  element.style.width = element.style.height = `${Math.max(this.w, this.h, this.d)}px`;
  this.selectObject = { element };
  this.selectObject.updateTransform = () => {
    this.selectObject.element.style.transform = `
      translate3D(${this.x}px, ${this.y}, ${this.z}px)
      translate(-50%, -50%)
      rotateZ(${-camera.rz}rad)
      rotateY(${-camera.ry}rad)
      rotateX(${-camera.rx}rad)
    `;
  };
  document.querySelector('.scene').append(element);
  // this.model.element.append(this.selectElement);
  camera.followers.push(this.selectObject);
};

// Assuming all game objects should have event listeners for clicking on them?
GameObject.prototype.addSelectEventListeners = function () {
  // Assumes every side of the shape should be used for selection
  this.model.sides.forEach((side) => {
    side.element.addEventListener('click', () => {
      if (!this.selected) this.select();
    });
  });
};
