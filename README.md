# Pathfinding Algorithm Visualizer

En interaktiv visualisering der sammenligner **A*** og **Dijkstra's** pathfinding algoritmer


**🔗 [Åben live demo her](https://your-deployment-url.com)**

---

## Billede af applikation

![Application Screenshot](https://r2.fivemanage.com/rTtmZA8AxmVWC1BX4dA2W/Skrmbillede2026-01-08034240.png)
*Race Mode: A* (lilla) vs Dijkstra (blå) pathfinding*

---

## Beskrivelse

Dette projekt visualiserer to klassiske pathfinding-algoritmer - **A*** og **Dijkstra** - i et interaktivt miljø.

Forestil dig en GPS der skal finde den korteste vej mellem to punkter. A* er den smarte GPS der ved hvor målet er og går direkte derhen. Dijkstra er den langsomme GPS der udforsker alle veje i alle retninger før den finder den korteste. Her kan du tegne dine egne baner og se direkte hvordan de 2 algoritmer arbejder mod den hurtigste vej.

**Hvad kan du gøre:**
- Kør begge algoritmer **side-om-side** og se hvem der vinder - Eller hvem der finder den hurtigste vej først
- Tegn egne baner med obstacles og udfordringer
- Sammenlign performance (hvor mange felter udforskes)
- Se step-by-step hvordan algoritmerne arbejder

---

## Algoritmer og Datastrukturer

### [A*/A-Star](https://en.wikipedia.org/wiki/A*_search_algorithm)
En **informed search** algoritme der bruger heuristics til at guide søgningen mod målet.

```javascript
f(n) = g(n) + h(n)
```
- `g(n)` = Faktisk distance fra start
- `h(n)` = Estimeret distance til mål (Euclidean distance)
- `f(n)` = Total estimeret cost

**Resultat:** Hurtig, målrettet søgning.

### [Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
En **uninformed search** algoritme der udforsker uniformt i alle retninger.

```javascript
f(n) = g(n)  // Ingen heuristic
```

**Resultat:** Langsommere, men garanteret optimal vej.

### Anvendte Datastrukturer
- **Priority Queue** (Min-Heap) - Vælger næste node at udforske
- **Map** - Tracker costs og parent pointers
- **Set** - Holder styr på udforskede nodes
- **2D Array** - Grid representation af banen

---

## Kør Lokalt

### Dependencies
- Node.js (v16 eller nyere) Lokalt brugte jeg selv v24.12.0
- npm eller yarn

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/ValdemarLarsen02/dsa-eksamen-formel1
cd dsa-eksamen-formel1
```

2. **Installer dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Åbn browser:**
```
http://localhost:5173
```


---

## Sådan Bruger Du Applikationen

### Race Mode
Ønsker du at køre de 2 algoritmer mod hinanden, skal du vælge slå "Algoritme løbet" til
Ellers vil du kun se A* algoritmen.

### Redigering af banen/canvas
1. Klik **"Rediger"**
2. **Venstre-klik:** Placer væg
3. **Højre-klik:** Slet væg
4. **SHIFT + klik:** slet flere vægge samtidigt
5. Klik **"SE"** og test din bane!

---

## Teknologier

- React 18
- JavaScript
- HTML5 Canvas
- Tailwind CSS
- Vite



## Udviklet Af
Valdemar Larsen  
[GitHub](https://github.com/ValdemarLarsen02)

