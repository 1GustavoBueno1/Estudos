// Debounce: só executa "fn" depois que "delay" ms se passaram
// sem que a função voltasse a ser chamada.
function debounce(fn, delay) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

module.exports = { debounce };
