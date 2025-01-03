import { patterns, transformations } from "./utils/ravenPatterns";

class RavenMatrixGenerator {
  constructor() {
    this.difficultyConfig = {
      1: { patterns: 2, transforms: 2, elements: 2 },
      2: { patterns: 3, transforms: 3, elements: 3 },
      3: { patterns: 4, transforms: 4, elements: 4 },
    };
  }

  async generateMatrix(level) {
    const config = this.difficultyConfig[level];
    if (!config) {
      throw new Error(`Livello di difficoltà ${level} non supportato`);
    }

    const selectedPatterns = this.selectPatterns(config.patterns);
    const matrix = await this.createMatrix(selectedPatterns, config);

    // Genera le opzioni prima di validare
    const options = await this.generateOptions(matrix, level);

    // Aggiungi le opzioni alla matrice
    matrix.options = options.allOptions;
    matrix.correctAnswer = options.correctIndex;

    // Ora valida la matrice
    this.validateMatrix(matrix);

    return {
      cells: matrix.cells,
      options: matrix.options,
      correctAnswer: matrix.correctAnswer,
      level,
      patterns: selectedPatterns,
    };
  }

  selectPatterns(count) {
    return patterns
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((pattern) => ({
        ...pattern,
        transforms: this.selectTransformations(pattern.compatibleTransforms),
      }));
  }

  selectTransformations(compatibleTypes) {
    return transformations
      .filter((t) => compatibleTypes.includes(t.type))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
  }

  async createMatrix(selectedPatterns, config) {
    const cells = [];
    const baseElements = this.generateBaseElements(config.elements);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (row === 2 && col === 2) continue; // Cella vuota per la risposta

        const elements = this.applyPatterns(
          baseElements,
          selectedPatterns,
          row,
          col,
        );
        if (this.isValidElements(elements)) {
          cells.push(this.generateSVG(elements));
        } else {
          const newElements = this.applyPatterns(
            baseElements,
            selectedPatterns,
            row,
            col,
          );
          cells.push(this.generateSVG(newElements));
        }
      }
    }

    return { cells, baseElements, patterns: selectedPatterns };
  }

  generateBaseElements(count) {
    return Array(count)
      .fill(null)
      .map(() => ({
        type: this.randomChoice(["circle", "square", "triangle"]),
        size: 40, // Aumentata la dimensione base degli elementi
        color: this.randomChoice([
          "#1e88e5",
          "#43a047",
          "#e53935",
          "#fbc02d",
          "#8e24aa",
        ]),
        position: { x: 50, y: 50 }, // Centrato nella cella
        rotation: 0,
      }));
  }

  applyPatterns(baseElements, patterns, row, col) {
    return baseElements.map((element) => {
      let modified = { ...element };
      patterns.forEach((pattern) => {
        pattern.transforms.forEach((transform) => {
          // Limita le trasformazioni per evitare che gli elementi escano dai bordi
          modified = transform.apply(modified, row, col);
          modified.position.x = Math.max(30, Math.min(70, modified.position.x)); // Limita la posizione X
          modified.position.y = Math.max(30, Math.min(70, modified.position.y)); // Limita la posizione Y
          modified.size = Math.max(30, Math.min(50, modified.size)); // Aumentata la dimensione
        });
      });
      return modified;
    });
  }

  generateSVG(elements) {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="translate(50,50) scale(1.2)">`; // Aumentata la scala per rendere le figure più grandi

    elements.forEach((element) => {
      const transform = `rotate(${element.rotation}) scale(${element.size / 100}) translate(${element.position.x - 50},${element.position.y - 50})`;

      switch (element.type) {
        case "circle":
          svg += `<circle r="${element.size / 2}" fill="${element.color}" stroke="#000" stroke-width="1" transform="${transform}"/>`;
          break;
        case "square":
          svg += `<rect x="${-element.size / 2}" y="${-element.size / 2}" width="${element.size}" height="${element.size}" fill="${element.color}" stroke="#000" stroke-width="1" transform="${transform}"/>`;
          break;
        case "triangle":
          const points = this.generateTrianglePoints(element.size);
          svg += `<polygon points="${points}" fill="${element.color}" stroke="#000" stroke-width="1" transform="${transform}"/>`;
          break;
      }
    });

    svg += `</g></svg>`;
    return svg;
  }

  generateTrianglePoints(size) {
    const h = (size * Math.sqrt(3)) / 2;
    return `0,${h / 2} ${-size / 2},${-h / 2} ${size / 2},${-h / 2}`;
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  async generateOptions(matrix, level) {
    const correctAnswer = this.applyPatterns(
      matrix.baseElements,
      matrix.patterns,
      2,
      2,
    );
    const correctSVG = this.generateSVG(correctAnswer);

    const incorrectOptions = await this.generateIncorrectOptions(
      matrix,
      level,
      correctAnswer,
    );

    const allOptions = [correctSVG, ...incorrectOptions].sort(
      () => Math.random() - 0.5,
    );

    return {
      allOptions,
      correctIndex: allOptions.indexOf(correctSVG),
    };
  }

  async generateIncorrectOptions(matrix, level, correctAnswer) {
    const options = [];
    const numOptions = 3;

    for (let i = 0; i < numOptions; i++) {
      const variation = this.createVariation(correctAnswer, level);
      options.push(this.generateSVG(variation));
    }

    return options;
  }

  createVariation(elements, level) {
    return elements.map((element) => {
      const modified = { ...element };
      const variations = [
        () => {
          modified.rotation += 45;
        },
        () => {
          modified.size *= 1.1;
        },
        () => {
          modified.position.x += 5;
        },
        () => {
          modified.position.y += 5;
        },
        () => {
          modified.color = this.randomChoice([
            "#1e88e5",
            "#43a047",
            "#e53935",
            "#fbc02d",
            "#8e24aa",
          ]);
        },
        () => {
          modified.rotation -= 30;
        },
        () => {
          modified.size *= 0.9;
        },
        () => {
          modified.position.x -= 5;
        },
        () => {
          modified.position.y -= 5;
        },
      ];

      for (let i = 0; i < 2; i++) {
        this.randomChoice(variations)();
      }

      return modified;
    });
  }

  validateMatrix(matrix) {
    if (
      matrix.correctAnswer < 0 ||
      matrix.correctAnswer >= matrix.options.length
    ) {
      throw new Error("Indice di risposta corretta non valido");
    }

    const correctSVG = matrix.options[matrix.correctAnswer];
    matrix.options.forEach((option, index) => {
      if (index === matrix.correctAnswer) return; // Salta la risposta corretta
      if (this.isTooSimilar(option, correctSVG)) {
        throw new Error("Opzione troppo simile alla risposta corretta");
      }
    });
  }

  isValidElements(elements) {
    const cellSize = 100; // Dimensione della cella
    const padding = 20; // Margine interno per evitare che gli elementi tocchino i bordi

    for (const element of elements) {
      const { position, size } = element;
      const halfSize = size / 2;

      // Verifica che l'elemento non esca dai bordi della cella
      if (
        position.x - halfSize < padding ||
        position.x + halfSize > cellSize - padding ||
        position.y - halfSize < padding ||
        position.y + halfSize > cellSize - padding
      ) {
        return false;
      }
    }

    return true;
  }

  isTooSimilar(option, correctSVG) {
    // Implementa la logica per determinare se due SVG sono troppo simili
    return false; // Placeholder: Implementa la logica reale
  }
}

export default RavenMatrixGenerator;
