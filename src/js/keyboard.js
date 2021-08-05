const keys = new Set();

document.onkeydown = (event) => {
  keys.add(event.key);
};

document.onkeyup = (event) => {
  keys.delete(event.key);
};

export default keys;
