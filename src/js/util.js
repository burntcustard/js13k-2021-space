export const toRad = (angle) => angle * (Math.PI / 180);

export const toDeg = (angle) => (angle * 180) / Math.PI;

export const $ = (selectors) => document.querySelector(selectors);

export const halfPi = Math.PI / 2;
export const thirdPi = Math.PI / 3;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const lerp = (a, b, mix) => a * (1 - mix) + b * mix;
