import resources from './resources';
import { $, lerp } from './util';

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
  update(elapsed) {
    // Check if any ships are able to dock
    const emptyBays = this.bays.filter((bay) => bay.ship === null);
    while (emptyBays.length && this.dockingQueue.length) {
      const bay = emptyBays.pop();
      const ship = this.dockingQueue.pop();
      ship.dock(bay);
      ship.status = 'docked';
    }

    this.ships.forEach((ship) => {
      ship.update(elapsed); // TODO: Does a ship need updaing if it's not flying?

      switch (ship.status) {
        case 'ready':
          if (!ship.bay) break; // Sometimes ready ships don't have a bay?
          if (ship.bay.hangar.active && resources.mats.current < resources.mats.capacity) {
            ship.undock();
            ship.status = 'mining';
            ship.timer = lerp(MIN_MINING_TIME, MAX_MINING_TIME, Math.random());
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
            // Return to the station and join the queue to dock
            ship.status = 'queuing';
            this.dockingQueue.push(ship);
          }
          break;
        case 'queuing':
          // TODO: use energy whilst waiting and die if it runs out?
          break;
        default:
        // Unknown status, do nothing
      }
    });

    $('.ship-controller').innerText = this.ships.map((ship) => `${ship.id}: `
      + `${ship.status}${ship.status === 'mining' ? `(${Math.floor(ship.timer / 1000)})` : ''} `
      + `↯${Math.floor(ship.power)}`)
      .join('\n');
  },
};

export default ShipController;
