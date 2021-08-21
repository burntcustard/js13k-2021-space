function Resources() {
  this.mats = {
    capacity: 1000,
    current: 100,
  };
  this.power = {
    gen: 0,
    use: 0,
    capacity: 100,
    current: 1000,
  };
}

export default new Resources();
