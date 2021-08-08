export const toRad = (angle) => angle * (Math.PI / 180);

export const toDeg = (angle) => (angle * 180) / Math.PI;

export const $ = (selectors) => document.querySelector(selectors);
