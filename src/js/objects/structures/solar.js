import Structure from './structure';
import Face from '../../shapes/face';

export default class Solar extends Structure {
  constructor(props) {
    const w = 30;
    const h = 10;
    const d = 60; // Structure needs depth for collisions, but model doesn't?

    super({ w, h, d, ...props, powerGen: 10 });

    // Create a new box shape
    this.model = [
      new Face({
        w,
        h: d,
        x: props.x,
        y: props.y,
        z: props.z - 1,
        className: 'solar',
      }),
      new Face({
        w,
        h: d,
        x: props.x,
        y: props.y,
        z: props.z,
        className: 'solar',
      }),
      new Face({
        w,
        h: d,
        x: props.x,
        y: props.y,
        z: props.z + 1,
        className: 'solar',
      }),
    ];
  }
}
