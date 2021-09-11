import resources from './resources';

/* eslint-disable no-nested-ternary */
function createBuildScreenHTML(Item) {
  const noEco = Item.cost > resources.mats.current;
  const unlocked = Item.unlock === true;

  const popNeeded = Item.populationRequired === undefined ? 0 : Item.populationRequired * (Item.prototype.count + 1);
  const morePopNeeded = Item.populationRequired === undefined ? 0 : popNeeded > resources.population.current;

  return `
    <div>
      <b>${unlocked ? Item.tag : 'LOCKED'}</b>
      <div>${unlocked ? `${noEco ? '<b>' : ''}M:${Item.cost}${noEco ? '</b>' : ''}${popNeeded ? ` | ${morePopNeeded ? '<b>' : ''}Pop Needed:${popNeeded}${morePopNeeded ? '</b>' : ''}` : Item.population ? ` | Pop:${Item.population}` : ''}${Item.power < 0 ? ` | Use ↯${-Item.power}` : Item.power > 0 ? ` | Gen ↯${Item.power}` : ''}` : ''}</div>
    </div>
    <div>
      ${!morePopNeeded ? (unlocked ? (noEco ? 'INSUFFICIENT RESOURCES' : Item.desc) : `-  ${Item.unlockText}`) : 'MORE POPULATION REQUIRED'}
    </div>
  `;
}

export default createBuildScreenHTML;
