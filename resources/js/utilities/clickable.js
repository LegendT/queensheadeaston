const cards = document.querySelectorAll(".clickable");

Array.prototype.forEach.call(cards, (card) => {
  let down,
    up,
    link = card.querySelector(".clickable a");
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
    }
  };
});
