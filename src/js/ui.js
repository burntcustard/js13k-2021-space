import resources from './resources';
import { $ } from './util';

const matsBar = $('.mats .fill');
const matsDot = $('.mats .dot');
const matsCap = $('.mats .cap');
const powerBar = $('.power .fill');
const powerDot = $('.power .dot');
const powerGen = $('.power .gen');
const powerUse = $('.power .use');
const powerNum = $('.power .num');
const powerCap = $('.power .cap');

const UI = {};

UI.update = () => {
  matsBar.style.width = `${(100 / resources.mats.capacity) * resources.mats.current}%`;
  matsDot.classList.toggle('empty', resources.mats.current < 1);
  matsCap.innerText = `${Math.floor(resources.mats.current)} /  ${resources.mats.capacity}`;

  powerBar.style.width = `${(100 / resources.power.capacity) * resources.power.current}%`;
  powerDot.classList.toggle('empty', resources.power.current < 1);
  powerGen.innerText = `+${resources.power.gen}`;
  powerUse.innerText = `-${resources.power.use}`;
  const num = resources.power.gen - resources.power.use;
  powerNum.innerText = (num <= 0 ? '' : '+') + num;
  powerNum.classList.toggle('neg', num > 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
};

export default UI;
