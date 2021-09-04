import { camera } from '../camera';

export default function Planet({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;

  this.element = document.createElement('div');
  this.element.className = 'planet';
  this.element.style.transform = `
    translate3D(${this.x}px, ${this.y}px, ${this.z}px)
  `;

  this.bodyElement = document.createElement('div');
  this.bodyElement.style.width = `${r * 2}px`;
  this.bodyElement.style.height = `${r * 2}px`;
  this.bodyElement.className = 'circle body';

  this.ringElement = document.createElement('div');
  this.ringElement.style.width = `${r * 8}px`;
  this.ringElement.style.height = `${r * 8}px`;
  this.ringElement.className = 'ring';
  this.ringElement.style.transform = `
    scale3D(8, 8, 8)
  `;

  this.element.append(this.bodyElement, this.ringElement);
  // TODO: A new filter for whatever type of planet this is
  // this.element.style.filter = 'url(#noise)';
  document.querySelector('.scene').append(this.element);

  // When the camera moves, this will updateTransform();
  camera.followers.push(this);

  this.updateTransform = () => {
    // This was an attempt to take into account the position of the circle
    // on the screen to adjust it slightly to stop the hula hooping, but is meh
    // const clientRect = this.element.getBoundingClientRect();
    // const xOffset = clientRect.left + clientRect.right - window.innerWidth;
    // const yOffset = clientRect.top + clientRect.bottom - window.innerWidth;
    // const xDist = Math.abs(this.x - camera.x);
    // const yDist = Math.abs(this.y - camera.y);
    // translate(${xOffset}px, ${yOffset}px)

    // Position the celestial body - this shouldn't change much so maybe don't do
    // every update?

    // Make the circle face the camera so it looks like a sphere.
    // the rotate90 is just temporary to make the lighting line up
    this.bodyElement.style.transform = `
      rotateZ(${-camera.rz}rad)
      rotateX(${-camera.rx}rad)
      scale(32)
    `;
    // rotateY(${-camera.ry}rad) // We don't actually need Y rotation?
  };

  this.updateTransform();
}
