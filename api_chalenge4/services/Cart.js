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
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.items.splice(i, 1)
      }
    }
  }

  duplicate() {
    const deep_copy = structuredClone(this.items)
    const newcart = new Cart()
    newcart.items = deep_copy
    return newcart
  }
}
module.exports = Cart;
