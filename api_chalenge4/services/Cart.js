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
        this.total -= this.items[i].price
        this.items.splice(i, 1)
      }
    }
  }

  duplicate() {
    const deep_copy_item = structuredClone(this.items)
    const deep_copy_total = structuredClone(this.total)
    const newcart = new Cart()
    newcart.items = deep_copy_item
    newcart.total = deep_copy_total
    return newcart
  }
}
module.exports = Cart;
