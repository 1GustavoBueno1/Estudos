class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  addItem(item) {
    this.items.push(item);
    this.total += item.price;
  }

  removeItemsById(id) {
    this.items.forEach((item, index) => {
      if (item.id === id) {
        this.items.splice(index, 1);
      }
    });
  }

  duplicate() {
    return { ...this };
  }
}

module.exports = Cart;
