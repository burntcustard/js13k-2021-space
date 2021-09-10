import resources from './resources';
import { $, lerp, PI } from './util';
import Vec3 from './vec3';

const MIN_MINING_TIME = 10000;
const MAX_MINING_TIME = 30000;
const SHIP_POWER_PER_S = 1;
const SHIP_CHARGE_PER_S = 2;
const SHIP_POWER_CAPACITY = (MAX_MINING_TIME / 1000) * SHIP_POWER_PER_S;

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
      ship.status = 'aligning';
      ship.destination = bay.hangar.arrivalPoint;
    }

    this.ships.forEach((ship) => {
      switch (ship.status) {
        case 'ready':
          if (ship.bay.hangar.active && resources.mats.current < resources.mats.capacity) {
            ship.undock();
            ship.status = 'undocking';
            ship.timer = lerp(MIN_MINING_TIME, MAX_MINING_TIME, Math.random());
          }
          break;
        case 'undocking':
          if (ship.destination === null) {
            ship.status = 'mining';
            ship.destination = new Vec3(1000, 0, 0).rotateZ(Math.random() * PI * 2);
          }
          break;
        case 'mining':
          // Once timer is depleted return to base
          ship.timer = Math.max(ship.timer - elapsed, 0);
          ship.power = Math.max(
            ship.power - SHIP_POWER_PER_S * (elapsed / 1000),
            0,
          );
          if (ship.timer === 0) {
            // Return to the station
            ship.status = 'returning';
            ship.destination = { x: 0, y: 0, z: 100 };
          }
          break;
        case 'returning':
          if (ship.destination === null) {
            // Return the queue to dock
            ship.status = 'queuing';
            this.dockingQueue.push(ship);
          }
          break;
        case 'queuing':
          // TODO: use energy whilst waiting and die if it runs out?
          break;
        case 'aligning':
          if (ship.destination === null) {
            ship.status = 'docking';
            ship.destination = { x: ship.bay.hangar.x, y: ship.bay.hangar.y, z: ship.bay.hangar.z };
          }
          break;
        case 'docking':
          if (ship.destination === null) {
            ship.status = 'docked';
          }
          break;
        case 'docked':
          // Offload mats and start charging
          resources.mats.current = Math.min(resources.mats.current + 50, resources.mats.capacity);
          ship.bay.hangar.power -= SHIP_CHARGE_PER_S;
          if (ship.bay.hangar.active) resources.power.use += SHIP_CHARGE_PER_S;
          ship.status = 'charging';
          break;
        case 'charging':
          if (ship.bay.hangar.active) {
            // Charge ship until fully charged
            ship.power = Math.min(
              ship.power + SHIP_CHARGE_PER_S * (elapsed / 1000),
              SHIP_POWER_CAPACITY,
            );
            if (ship.power === SHIP_POWER_CAPACITY) {
              ship.status = 'ready';
              ship.bay.hangar.power += SHIP_CHARGE_PER_S;
              resources.power.use -= SHIP_CHARGE_PER_S;
            }
          }
          break;
        default:
        // Unknown status, do nothing
      }

      ship.update(elapsed, lights);
    });

    $('.ship-controller').innerText = this.ships.map((ship) => `${ship.id}: `
      + `${ship.status}${ship.status === 'mining' ? `(${Math.floor(ship.timer / 1000)})` : ''} `
      + `↯${Math.floor(ship.power)}`)
      .join('\n');
  },
};

export default ShipController;
