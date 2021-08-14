import Structure from './structure';
import Box from '../../shapes/box';

export default class Solar extends Structure {
  constructor(props) {
    const w = 30;
    const h = 10;
    const d = 60; // Structure needs depth for collisions, but model doesn't?

    super({ w, h, d, ...props, powerGen: 10 });

    this.model = new Box({
      w: 50,
      h: 2,
      d: 20,
      x: props.x,
      y: props.y,
      z: props.z,
    });
  }
}
