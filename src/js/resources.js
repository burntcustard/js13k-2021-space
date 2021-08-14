import { clamp } from './util';

function Resources() {
  this.power = {
    diff: 0,
    capacity: 1000,
    current: 1000,
  };

  this.update = (elapsed) => {
    this.power.current = clamp(
      this.power.current + this.power.diff * (elapsed / 1000),
      0,
      this.power.capacity,
    );
    this.power.diff = 0;
  };
}

export default new Resources();
