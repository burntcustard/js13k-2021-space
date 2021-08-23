import Object from '../objects/object';
import resources from '../resources';

export default class Structure extends Object {
  constructor(props) {
    super({ ...props });
    this.powerGen = props.powerGen ?? 0;
    this.powerUse = props.powerUse ?? 0;
    this.enable();
  }

  doStuff(elapsed) {
    // Grab some power from the resources banks
    if (this.powerUse) {
      resources.power.current = Math.max(
        resources.power.current - this.powerUse * (elapsed / 1000),
        0,
      );

      // You used all the power and now this thing is shutting down!
      if (resources.power.current === 0) {
        this.shutdown();
      }
    }

    if (this.powerGen) {
      resources.power.current = Math.min(
        resources.power.current + this.powerGen * (elapsed / 1000),
        resources.power.capacity,
      );
    }
  }

  update(elapsed, lights) {
    super.update(elapsed, lights);

    if (this.active) {
      this.doStuff(elapsed);
    }

    if (this.restartTimer) {
      this.restartTimer = Math.max(this.restartTimer - elapsed, 0);

      if (this.restartTimer === 0) {
        this.enable();
      }
    }
  }

  disable() {
    this.active = false;
    resources.power.use -= this.powerUse;
    resources.power.gen -= this.powerGen;
  }

  enable() {
    this.active = true;
    resources.power.use += this.powerUse;
    resources.power.gen += this.powerGen;
  }

  // If you run out of power, shut down this structure
  shutdown() {
    this.disable();
    this.restartTimer = 3000; // Reboot after 3s
  }
}
