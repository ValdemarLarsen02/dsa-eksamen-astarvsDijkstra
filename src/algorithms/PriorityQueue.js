
/* 
  Kø hvor elementer med lavest prioritet kommer først
  Bruges i A* til at finde ud hvilken node har den lavese f-score
  Bruges til at sikre vi altid tjekker/udforsker den node som er mest lovende


*/


class PriorityQueue {
  constructor() {
    this.items = []; // {item, priority} objekter
  }

  // Tilføjer element og sorter efter prioritet(smider laveste først)
  push(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  //Fjerner og returner elementet med lavese prioritet
  pop() {
    return this.items.shift()?.item;
  }

  //A* Stopper når tom.
  isEmpty() {
    return this.items.length === 0;
  }

  //Tjek af antal elementer i køen
  size() {
    return this.items.length;
  }
}

export default PriorityQueue