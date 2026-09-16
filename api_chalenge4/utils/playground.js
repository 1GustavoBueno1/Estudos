const { debounce } = require("./debounce");

let callCount = 0;
function search(term) {
  callCount++;
  console.log(`[chamada ${callCount}] buscando por: "${term}"`);
}

const debouncedSearch = debounce(search, 300);

console.log("Simulando alguém digitando rápido: 'g', 'gu', 'gus', 'gust'...");
debouncedSearch("gust");

console.log(
  "\nEsperado: só 1 chamada de verdade a 'search', ~300ms depois, com 'gust'."
);
console.log("Aguardando 500ms pra ver o que realmente acontece...\n");

setTimeout(() => {
  console.log(`\nTotal de chamadas reais a "search": ${callCount}`);
}, 500);
