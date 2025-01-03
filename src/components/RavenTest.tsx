import React, { useState, useEffect } from "react";
import { Brain, Scale } from "lucide-react";

interface ShapeProps {
  type: string; // 'circle' | 'square' | 'triangle' | 'diamond'
  rotation?: number;
  size?: number;
  color?: string;
  opacity?: number;
  scale?: number;
}

interface Answer extends ShapeProps {
  isCorrect: boolean;
}

interface RavenTestProps {
  onComplete: (results: { score: number; accuracy: number }) => void;
}

const Shape: React.FC<ShapeProps> = ({
  type,
  rotation = 0,
  size = 20,
  color = "currentColor",
  opacity = 1,
  scale = 1,
}) => {
  const center = size / 2;
  const adjustedSize = size * scale;
  const baseSize = adjustedSize * 0.35;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g
        transform={`rotate(${rotation}, ${center}, ${center})`}
        opacity={opacity}
      >
        {type === "circle" && (
          <circle cx={center} cy={center} r={baseSize} fill={color} />
        )}
        {type === "square" && (
          <rect
            x={center - baseSize}
            y={center - baseSize}
            width={baseSize * 2}
            height={baseSize * 2}
            fill={color}
          />
        )}
        {type === "triangle" && (
          <polygon
            points={`
              ${center},${center - baseSize}
              ${center + baseSize},${center + baseSize}
              ${center - baseSize},${center + baseSize}
            `}
            fill={color}
          />
        )}
        {type === "diamond" && (
          <polygon
            points={`
              ${center},${center - baseSize}
              ${center + baseSize},${center}
              ${center},${center + baseSize}
              ${center - baseSize},${center}
            `}
            fill={color}
          />
        )}
      </g>
    </svg>
  );
};

/**
 * Funzione per convertire la rotazione "reale" in una rotazione "visiva" normale.
 * Esempi:
 *  - circle => 0   (qualsiasi rotation => 0)
 *  - square/diamond => mod 90 (multipli di 90°, 0, 90, 180, 270 appaiono uguali)
 *  - triangle => mod 120
 */
function normalizeVisualRotation(shape: string, rotation: number): number {
  switch (shape) {
    case "circle":
      return 0;
    case "square":
    case "diamond":
      // riduciamo la rotazione a un numero 0..89
      return rotation % 90;
    case "triangle":
      // riduciamo la rotazione a un numero 0..119
      return rotation % 120;
    default:
      return rotation;
  }
}

/**
 * Confronta se due risposte sono "visivamente" identiche,
 * normalizzando la rotazione in base alla forma.
 */
function areVisuallyIdentical(a: ShapeProps, b: ShapeProps): boolean {
  if (a.type !== b.type) return false;
  if (a.color !== b.color) return false;
  if (a.opacity !== b.opacity) return false;
  if (a.scale !== b.scale) return false;

  const normA = normalizeVisualRotation(a.type, a.rotation ?? 0);
  const normB = normalizeVisualRotation(b.type, b.rotation ?? 0);

  return normA === normB;
}

/**
 * Genera un Answer completamente casuale (tranne isCorrect).
 */
function createRandomAnswer(
  shapes: string[],
  rotations: number[],
  colors: string[],
  opacities: number[],
  scales: number[],
  isCorrect: boolean,
): Answer {
  return {
    type: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: rotations[Math.floor(Math.random() * rotations.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: opacities[Math.floor(Math.random() * opacities.length)],
    scale: scales[Math.floor(Math.random() * scales.length)],
    isCorrect,
  };
}

const RavenTest: React.FC<RavenTestProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const [matrix, setMatrix] = useState<Array<Array<ShapeProps | null>>>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Config di base
  const systemConfig = {
    shapes: ["circle", "square", "triangle", "diamond"],
    rotations: [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330],
    colors: ["#2563eb", "#dc2626", "#059669", "#7c2d12", "#6b21a8", "#0f766e"],
    opacities: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
    scales: [0.6, 0.8, 1, 1.2, 1.4, 1.6],
  };

  const complexityMatrix = {
    1: { shapes: 2, rotations: 1, colors: 1, opacities: 1, scales: 1 },
    2: { shapes: 2, rotations: 2, colors: 1, opacities: 1, scales: 1 },
    3: { shapes: 3, rotations: 2, colors: 2, opacities: 1, scales: 1 },
    4: { shapes: 3, rotations: 4, colors: 2, opacities: 1, scales: 1 },
    5: { shapes: 3, rotations: 4, colors: 3, opacities: 1, scales: 1 },
    6: { shapes: 4, rotations: 4, colors: 3, opacities: 2, scales: 1 },
    7: { shapes: 4, rotations: 6, colors: 3, opacities: 2, scales: 2 },
    8: { shapes: 4, rotations: 8, colors: 4, opacities: 3, scales: 2 },
    9: { shapes: 4, rotations: 8, colors: 4, opacities: 4, scales: 3 },
    10: { shapes: 4, rotations: 10, colors: 4, opacities: 4, scales: 3 },
    11: { shapes: 4, rotations: 12, colors: 5, opacities: 6, scales: 4 },
    12: { shapes: 4, rotations: 13, colors: 6, opacities: 7, scales: 5 },
    13: { shapes: 4, rotations: 14, colors: 6, opacities: 8, scales: 6 },
  };

  /**
   * Genera pattern "avanzato" per i livelli 11–13 (con sin, cos, tan).
   */
  function generateAdvancedPattern(
    i: number,
    j: number,
    level: number,
  ): ShapeProps {
    const basePattern: ShapeProps = {
      type: systemConfig.shapes[(i * 3 + j * 2) % systemConfig.shapes.length],
      rotation: ((i * 90 + j * 45) * level) % 360,
      color: systemConfig.colors[(i * 2 + j * 3) % systemConfig.colors.length],
      opacity: systemConfig.opacities[(i + j) % systemConfig.opacities.length],
      scale: systemConfig.scales[(i * j) % systemConfig.scales.length],
    };

    if (level === 11) {
      return {
        ...basePattern,
        rotation: (basePattern.rotation + Math.sin(i * j) * 30) % 360,
        scale:
          systemConfig.scales[
            Math.floor(Math.abs(Math.sin(i + j) * 4)) %
              systemConfig.scales.length
          ],
      };
    } else if (level === 12) {
      return {
        ...basePattern,
        rotation: (basePattern.rotation + Math.cos(i * j * Math.PI) * 45) % 360,
        opacity:
          systemConfig.opacities[
            Math.floor(Math.abs(Math.cos(i + j) * 6)) %
              systemConfig.opacities.length
          ],
      };
    } else {
      // Livello 13
      return {
        ...basePattern,
        rotation: (basePattern.rotation + Math.tan(i * j) * 60) % 360,
        scale:
          systemConfig.scales[
            Math.floor(Math.abs(Math.tan(i + j) * 5)) %
              systemConfig.scales.length
          ],
        opacity:
          systemConfig.opacities[
            Math.floor(Math.abs(Math.sin(i * j * Math.PI) * 7)) %
              systemConfig.opacities.length
          ],
      };
    }
  }

  /**
   * Genera le 6 risposte, facendo attenzione a rimuovere i duplicati VISIVI.
   */
  function generateAnswers(correctAnswer: ShapeProps, level: number): Answer[] {
    const c = complexityMatrix[level];

    // 1) Inseriamo la corretta
    const allAnswers: Answer[] = [{ ...correctAnswer, isCorrect: true }];

    // 2) Creiamo 5 risposte sbagliate
    for (let i = 0; i < 5; i++) {
      let newAnswer: Answer;

      // Per i livelli <= 10, generiamo una "variante" della corretta
      if (level <= 10) {
        // Copiamo la base
        newAnswer = {
          ...correctAnswer,
          isCorrect: false,
        };

        // Applichiamo qualche modifica (come facevi prima)
        switch (i) {
          case 0:
            newAnswer.rotation = ((newAnswer.rotation ?? 0) + 45) % 360;
            break;
          case 1:
            newAnswer.type =
              systemConfig.shapes[
                (systemConfig.shapes.indexOf(newAnswer.type!) + 1) % c.shapes
              ];
            break;
          case 2:
            newAnswer.type =
              systemConfig.shapes[
                (systemConfig.shapes.indexOf(newAnswer.type!) + 2) % c.shapes
              ];
            newAnswer.rotation = ((newAnswer.rotation ?? 0) + 90) % 360;
            break;
          case 3:
            if (level >= 7) {
              newAnswer.scale = (newAnswer.scale ?? 1) * 1.2;
            }
            newAnswer.rotation = ((newAnswer.rotation ?? 0) + 180) % 360;
            break;
          case 4:
            if (level >= 6) {
              newAnswer.opacity = Math.max(0.3, (newAnswer.opacity ?? 1) - 0.2);
            }
            newAnswer.rotation = ((newAnswer.rotation ?? 0) + 135) % 360;
            break;
        }
      } else {
        // Per i livelli 11-13, usiamo qualcosa di random
        newAnswer = createRandomAnswer(
          systemConfig.shapes,
          systemConfig.rotations,
          systemConfig.colors,
          systemConfig.opacities,
          systemConfig.scales,
          false,
        );
      }

      // 3) Finché collide VISIVAMENTE con una già presente, rigenera
      while (allAnswers.some((ans) => areVisuallyIdentical(ans, newAnswer))) {
        newAnswer = createRandomAnswer(
          systemConfig.shapes,
          systemConfig.rotations,
          systemConfig.colors,
          systemConfig.opacities,
          systemConfig.scales,
          false,
        );
      }

      allAnswers.push(newAnswer);
    }

    return allAnswers.sort(() => Math.random() - 0.5);
  }

  /**
   * Genera la griglia (3x3) e la risposta corretta in base al livello.
   */
  function generatePattern(level: number) {
    const c = complexityMatrix[level];
    const newMatrix = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === 2 && j === 2) continue;
        if (level <= 10) {
          newMatrix[i][j] = {
            type: systemConfig.shapes[(i * 2 + j) % c.shapes],
            rotation:
              systemConfig.rotations[
                ((i + j) * (level >= 5 ? 2 : 1)) % c.rotations
              ],
            color:
              systemConfig.colors[
                Math.min((i * 2 + j) % c.colors, c.colors - 1)
              ],
            opacity:
              level >= 6
                ? systemConfig.opacities[
                    Math.min((i + j) % c.opacities, c.opacities - 1)
                  ]
                : 1,
            scale:
              level >= 7
                ? systemConfig.scales[
                    Math.min((i * j) % c.scales, c.scales - 1)
                  ]
                : 1,
          };
        } else {
          // Avanzato
          newMatrix[i][j] = generateAdvancedPattern(i, j, level);
        }
      }
    }

    let correctAnswer: ShapeProps;
    if (level <= 10) {
      correctAnswer = {
        type: systemConfig.shapes[(2 * 2 + 2) % c.shapes],
        rotation:
          systemConfig.rotations[
            ((2 + 2) * (level >= 5 ? 2 : 1)) % c.rotations
          ],
        color:
          systemConfig.colors[Math.min((2 * 2 + 2) % c.colors, c.colors - 1)],
        opacity:
          level >= 6
            ? systemConfig.opacities[Math.min(4 % c.opacities, c.opacities - 1)]
            : 1,
        scale:
          level >= 7
            ? systemConfig.scales[Math.min(4 % c.scales, c.scales - 1)]
            : 1,
      };
    } else {
      correctAnswer = generateAdvancedPattern(2, 2, level);
    }

    setAnswers(generateAnswers(correctAnswer, level));
    return newMatrix;
  }

  useEffect(() => {
    setMatrix(generatePattern(level));
    setSelectedAnswer(null);
  }, [level]);

  function handleAnswer(index: number) {
    setSelectedAnswer(index);
    const isCorrect = answers[index].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (level < 13) {
        setLevel((prev) => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        onComplete({
          score: finalScore,
          accuracy: finalScore / 13,
        });
      }
    }, 800);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">
            Matrici Progressive - Livello {level}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Scale className="w-5 h-5 text-blue-600" />
          <div className="space-x-2">
            <span className="font-mono">Livello {level}/13</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="w-24 h-24 flex items-center justify-center border border-gray-200 rounded-lg relative"
            >
              {cell ? (
                <Shape {...cell} size={40} />
              ) : (
                <span className="text-2xl text-gray-400">?</span>
              )}
            </div>
          )),
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Possibili soluzioni:</h3>
        <div className="grid grid-cols-3 gap-4">
          {answers.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors
                ${
                  selectedAnswer === idx
                    ? answer.isCorrect
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <Shape {...answer} size={40} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {level >= 11 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 font-medium">
            Livello Avanzato {level - 10}/3:{" "}
            {level === 11 && "Pattern Trigonometrici Base"}
            {level === 12 && "Pattern Trigonometrici Composti"}
            {level === 13 && "Pattern Trigonometrici Integrati"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RavenTest;
