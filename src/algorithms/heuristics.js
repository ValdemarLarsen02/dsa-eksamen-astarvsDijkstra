/* 
 Heuristic functions - Hjælper os med at estimere afstand fra en givende node til målet
 Bruges sammen med A* som giver os den guided søgning(Gør den smartere end fx Dijkstra)
*/
export const Heuristics = {
    /*
      Euclidean - Luftlinje distance (Pythagoras)
      Bedst til grid med diagonal bevægelse
     */
    euclidean: (a, b) => {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    },

    /*
       Manhattan - "Gade-afstand", kun op/ned/venstre/højre
       Bedst til grid uden diagonaler (4-retnings navigation)
    */
    manhattan: (a, b) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
};