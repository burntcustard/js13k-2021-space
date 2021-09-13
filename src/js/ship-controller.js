import resources from './resources';
import { $, lerp, PI } from './util';
import Vec3 from './vec3';

const MIN_MINING_TIME = 10000;
const MAX_MINING_TIME = 30000;
const SHIP_POWER_PER_S = 1;
const SHIP_CHARGE_PER_S = 3;
const SHIP_POWER_CAPACITY = (MAX_MINING_TIME / 1000) * SHIP_POWER_PER_S;

// TODO: Remove debug code
const statusMap = new Map([
  [0, 'ready'],
  [1, 'undocking'],
  [2, 'mining'],
  [3, 'returning'],
  [4, 'queuing'],
  [5, 'aligning'],
  [6, 'docking'],
  [7, 'docked'],
  [8, 'charging'],
]);

const ShipController = {
  ships: [],
  hangars: [],
  bays: [],
  dockingQueue: [],
  update(elapsed, lights) {
    // Check if any ships are able to dock
    const emptyBays = this.bays.filter((bay) => bay.ship === null);
    while (emptyBays.length && this.dockingQueue.length) {
      const bay = emptyBays.pop();
      const ship = this.dockingQueue.pop();
      ship.dock(bay);
      window.setTimeout(() => {
        ship.status = 5;
        ship.destination = bay.hangar.arrivalPoint;
      }, 3000);
    }

    this.ships.forEach((ship) => {
      if (ship.status === 0 && ship.bay.hangar.active) {
        // Ready: undock when hanger is active and capacity for mats
        ship.undock();
        ship.status = 1;
        ship.timer = lerp(MIN_MINING_TIME, MAX_MINING_TIME, Math.random());
      } else if (ship.status === 1 && ship.destination === null) {
        // Undocking: once undocked travel to a random point
        ship.status = 2;
        ship.destination = new Vec3(10000, 0, 0)
          .rotateY(Math.random() * 0.4 - 0.2)
          .rotateZ(Math.random() * PI * 2);
      } else if (ship.status === 2) {
        // Mining: wait until the timer is elapsed then return to the station
        ship.timer = Math.max(0, ship.timer - elapsed);
        ship.power = Math.max(0, ship.power - SHIP_POWER_PER_S * (elapsed / 1000));
        if (ship.timer === 0) {
          ship.status = 3;
          ship.destination = new Vec3(ship.x, ship.y, ship.z).resize(500);
        }
      } else if (ship.status === 3 && ship.destination === null) {
        // Returning: once back join the docking queue
        ship.status = 4;
        this.dockingQueue.push(ship);
      } else if (ship.status === 4) {
        // Queueing to dock
        // TODO: use energy whilst waiting and die if it runs out?
      } else if (ship.status === 5 && ship.destination === null) {
        // Aligning: line up with the hangar
        ship.status = 6;
        ship.destination = { x: ship.bay.hangar.x, y: ship.bay.hangar.y, z: ship.bay.hangar.z };
      } else if (ship.status === 6 && ship.destination === null) {
        // Docking: enter the hangar
        ship.status = 7;
      } else if (ship.status === 7) {
        // Docked: unload mats and start charging
        resources.mats.current = Math.min(resources.mats.current + 25, resources.mats.capacity);
        ship.bay.hangar.power -= SHIP_CHARGE_PER_S;
        if (ship.bay.hangar.active) resources.power.use += SHIP_CHARGE_PER_S;
        ship.status = 8;
      } else if (ship.status === 8 && ship.bay.hangar.active) {
        // Charging: charge ship until fully charged
        ship.power = Math.min(
          ship.power + SHIP_CHARGE_PER_S * (elapsed / 1000),
          SHIP_POWER_CAPACITY,
        );
        if (ship.power === SHIP_POWER_CAPACITY) {
          ship.status = 0;
          ship.bay.hangar.power += SHIP_CHARGE_PER_S;
          resources.power.use -= SHIP_CHARGE_PER_S;
        }
      }

      ship.update(elapsed, lights);
    });

    // $('.ship-controller').innerText = this.ships.map((ship) => `${ship.id}: `
    //   + `${statusMap.get(ship.status)}${ship.status === 2 ? `(${Math.floor(ship.timer / 1000)})` : ''} `
    //   + `↯${Math.floor(ship.power)}`)
    //   .join('\n');
  },
};

export default ShipController;
