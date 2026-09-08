const {
  paginate,
  removeById,
  findUserById,
  chunkArray,
  getConfig,
} = require("./challenge");

console.log("--- paginate ---");
console.log(paginate(["A", "B", "C", "D", "E"], { page: 1, limit: 2 }));
console.log(paginate(["A", "B", "C", "D", "E"], { page: 2, limit: 2 }));

console.log("--- removeById ---");
console.log(
  removeById(
    [
      { id: 10, title: "A" },
      { id: 20, title: "B" },
      { id: 30, title: "C" },
    ],
    20
  )
);

console.log("--- findUserById ---");
console.log(
  findUserById(
    [
      { id: 1, name: "Gustavo" },
      { id: 2, name: "Ana" },
    ],
    2
  )
);

console.log("--- chunkArray ---");
console.log(chunkArray([1, 2, 3, 4], { size: 2 }));

console.log("--- getConfig ---");
console.log(getConfig());
console.log(getConfig({ timeout: 5000 }));
