export const patterns = [
  {
    id: "pattern1",
    compatibleTransforms: ["rotate", "scale"],
    description: "Rotazione e scala uniformi",
  },
  {
    id: "pattern2",
    compatibleTransforms: ["translate", "mirror"],
    description: "Traslazione e specchiatura",
  },
  {
    id: "pattern3",
    compatibleTransforms: ["rotate", "translate"],
    description: "Rotazione e traslazione combinata",
  },
  {
    id: "pattern4",
    compatibleTransforms: ["scale", "mirror"],
    description: "Scala e specchiatura",
  },
  {
    id: "pattern5",
    compatibleTransforms: ["rotate", "scale", "translate"],
    description: "Combinazione di rotazione, scala e traslazione",
  },
];

export const transformations = [
  {
    type: "rotate",
    apply: (element, row, col) => {
      element.rotation += 45;
      return element;
    },
  },
  {
    type: "scale",
    apply: (element, row, col) => {
      element.size *= 1.1; // Scala ridotta per evitare che gli elementi diventino troppo grandi
      return element;
    },
  },
  {
    type: "translate",
    apply: (element, row, col) => {
      element.position.x += 5; // Traslazione ridotta per evitare che gli elementi escano dai bordi
      element.position.y += 5;
      return element;
    },
  },
  {
    type: "mirror",
    apply: (element, row, col) => {
      element.position.x = 100 - element.position.x; // Specchia rispetto al centro della cella
      return element;
    },
  },
  {
    type: "shear",
    apply: (element, row, col) => {
      element.position.x += 2; // Shear ridotto per evitare che gli elementi escano dai bordi
      element.position.y += 2;
      return element;
    },
  },
];
