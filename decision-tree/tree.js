const Tree = require('../models/tree');

// Función principal para obtener la recomendación de barrio
function getRecommendation(answersVector) {
  // Árbol de decisiones
  const decisionTree = {
    question: "¿Cuál es tu nivel de ingresos anuales en tu hogar?",
    options: [
      { value: "<15000", label: "Menos de 15000" },
      { value: "15000-25000", label: "15000-25000" },
      { value: "25000-40000", label: "25000-40000" },
      { value: "40000-75000", label: "40000-75000" },
      { value: ">75000", label: "Más de 75000" },
      { value: "estudiante", label: "Para estudiantes" }
    ],
    branches: {
      "<15000": { 
        question: "¿Te preocupa la contaminación acústica en el lugar donde vives?",
        options: [
          { value: "si", label: "Sí, me preocupa el ruido" },
          { value: "no", label: "No me preocupa el ruido" },
        ],
        branches: {
          "si": { 
            barrio: "66151d0bcc0535e96a0e7aed" 
          },
          "no": { 
            barrio: "66151d0bcc0535e96a0e7aef" 
          }
        }
      },
      "15000-25000": {
        question: "¿Prefieres vivir en una casa antes que en un piso?",
        options: [
          { value: "si", label: "Sí, me gustaría vivir en una casa mejor" },
          { value: "no", label: "No, prefiero vivir en un piso" },
        ],
        branches: {
          "si": { 
            barrio: "66151d0bcc0535e96a0e7ae7" 
          },
          "no": {
            question: "¿Te preocupa la contaminación acústica en el lugar donde vives?",
            options: [
              { value: "si", label: "Sí, me preocupa el ruido" },
              { value: "no", label: "No me preocupa el ruido" },
            ],
            branches: {
              "si": { 
                barrio: "66151d0bcc0535e96a0e7aeb" 
              },
              "no": { 
                barrio: "66151d0bcc0535e96a0e7ae9" 
              }
            }
          }
        }
      },
      "25000-40000": { 
        question: "¿Prefieres vivir en una casa antes que en un piso?",
        options: [
          { value: "si", label: "Sí, me gustaría vivir en una casa mejor" },
          { value: "no", label: "No, prefiero vivir en un piso" },
        ],
        branches: {
          "si": {
            barrio: "661520ab4fe57713db09c86b" 
          },
          "no": {
            question: "¿Te preocupa la contaminación acústica en el lugar donde vives?",
            options: [
              { value: "si", label: "Sí, me preocupa el ruido" },
              { value: "no", label: "No me preocupa el ruido" },
            ],
            branches: {
              "si": {
                question: "¿Prefieres vivir en un barrio con muchas opciones de entretenimiento como cines y centros comerciales?",
                options: [
                  { value: "si", label: "Sí, me gustaría tener muchas opciones de entretenimiento" },
                  { value: "no", label: "No necesito muchas opciones de entretenimiento" },
                ],
                branches: {
                  "si": {
                    barrio: "66151d0bcc0535e96a0e7ae1"
                  },
                  "no": {
                    barrio: "66151d0bcc0535e96a0e7ae3"
                  }
                }
              },
              "no": {
                barrio: "66151d0bcc0535e96a0e7ae5"
              }
            }
          }
        }
      },
      "40000-75000": { 
        question: "¿Prefieres vivir en una casa antes que en un piso?",
        options: [
          { value: "si", label: "Sí, me gustaría vivir en una casa mejor" },
          { value: "no", label: "No, prefiero vivir en un piso" },
        ],
        branches: {
          "si": {
            question: "¿Es fundamental que tu barrio tenga buenas conexiones con el transporte público?",
            options: [
              { value: "si", label: "Sí, es fundamental" },
              { value: "no", label: "No es fundamental" },
            ],
            branches: {
              "si": { 
                barrio: "66151d0bcc0535e96a0e7ad9" 
              },
              "no": { 
                barrio: "66151d0bcc0535e96a0e7adb" 
              }
            }
          },
          "no": {
            question: "¿Prefieres vivir en un barrio con muchas opciones de entretenimiento como cines y centros comerciales?",
            options: [
              { value: "si", label: "Sí, me gustaría tener muchas opciones de entretenimiento" },
              { value: "no", label: "No necesito muchas opciones de entretenimiento" },
            ],
            branches: {
              "si": { 
                barrio: "66151d0bcc0535e96a0e7add" 
              },
              "no": { 
                barrio: "66151d0bcc0535e96a0e7adf" 
              }
            }
          }
        }
      },
      ">75000": {
        question: "¿Prefieres vivir en una casa antes que en un piso?",
        options: [
          { value: "si", label: "Sí, me gustaría vivir en una casa mejor" },
          { value: "no", label: "No, prefiero vivir en un piso" },
        ],
        branches: {
          "si": {
            question: "¿Prefieres vivir en un barrio con muchas opciones de entretenimiento como cines y centros comerciales?",
            options: [
              { value: "no", label: "Prefiero un barrio tranquilo" },
              { value: "si", label: "Prefiero un barrio con mucha actividad social" },
            ],
            branches: {
              "no": { 
                barrio: "66151d0acc0535e96a0e7ad3" 
              },
              "si": { 
                barrio: "66151d0acc0535e96a0e7ad1" 
              }
            }
          },
          "no": {
            question: "¿Practicas deporte activamente?",
            options: [
              { value: "si", label: "Si hago deporte" },
              { value: "no", label: "No practico poco/muy poco deporte" },
            ],
            branches: {
              "si": {
                question: "¿Prefieres vivir en un barrio con grandes parques al aire libre o no?",
                options: [
                  { value: "si", label: "Prefiero un barrio con naturaleza" },
                  { value: "no", label: "Prefiero un barrio más concurrido de civilización" },
                ],
                branches: {
                  "si": { 
                    barrio: "66151d0acc0535e96a0e7ad5" 
                  },
                  "no": { 
                    barrio: "66151d0bcc0535e96a0e7ad7" 
                  }
                }
              },
              "no": {
                question: "¿Te preocupa la contaminación acústica en el lugar donde vives?",
                options: [
                  { value: "si", label: "No quiero ruido" },
                  { value: "no", label: "Me es igual el ruido" },
                ],
                branches: {
                  "si": { 
                    barrio: "66151d0acc0535e96a0e7ad5" 
                  },
                  "no": { 
                    barrio: "66151d0bcc0535e96a0e7ad7" 
                  }
                }
              }
            }
          }
        }
      },
      //aqui tenemos que poner la city, ya que es para estudiantes!!
      "estudiante": {
        barrio: "661a8d548821445f3797f221"
      }
    }
  };

  const incomeIndex = 7; // La posición donde está la pregunta sobre la renta
  const filteredResponses = getResponsesByIncome(answersVector, incomeIndex);
  return evaluateDecisionTree(decisionTree, filteredResponses);
}

// Función para obtener las respuestas relevantes basadas en el nivel de ingresos
function getResponsesByIncome(responses, incomeIndex) {
  const income = responses[incomeIndex];
  let filteredResponses = [];

  switch (income) {
    case "<15000":
      filteredResponses = [responses[incomeIndex], responses[13]];
      break;
    case "15000-25000":
      filteredResponses = [responses[incomeIndex], responses[6], responses[13]];
      break;
    case "25000-40000":
      filteredResponses = [responses[incomeIndex], responses[6], responses[13], responses[5]];
      break;
    case "40000-75000":
      filteredResponses = [responses[incomeIndex], responses[6], responses[10], responses[5]];
      break;
    case ">75000":
      if (responses[6] === "si") {
          filteredResponses = [responses[incomeIndex], responses[6], responses[5]];
      } else {
          filteredResponses = [responses[incomeIndex], responses[6], responses[0]];
          if (responses[0] === "si") {
              filteredResponses.push(responses[2]);
          } else {
              filteredResponses.push(responses[13]);
          }
      }
      break;
    case "estudiante":
      filteredResponses = [responses[incomeIndex]];
      break;
  }

  console.log(filteredResponses);

  return filteredResponses;
}

// Función para evaluar el árbol de decisiones y obtener la recomendación final
function evaluateDecisionTree(decisionTree, answers) {
  let currentNode = decisionTree;

  for (let i = 0; i < answers.length; i++) {
    const currentAnswer = answers[i].toLowerCase();

    if (!currentNode.branches || !currentNode.branches[currentAnswer]) {
      return "No se pudo determinar una recomendación.";
    }

    const currentBranch = currentNode.branches[currentAnswer];

    if (currentBranch.question) {
      currentNode = currentBranch;
    } else {
      if (currentBranch.barrio) {
        return currentBranch.barrio;
      } else {
        continue;
      }
    }
  }

  return "No se pudo determinar una recomendación de barrio.";
}



function actualizarResultados(recommendation) {
  return new Promise((resolve, reject) => {
    // Buscar el documento del árbol de decisiones en la base de datos
    Tree.findOne()
      .then(treeDocument => {
        // Si no se encuentra ningún documento, devolver un error
        if (!treeDocument) {
          reject(new Error('Documento Tree no encontrado'));
        }

        // Actualizar el contador del barrio recomendado
        treeDocument[recommendation] += 1;

        // Incrementar el total
        treeDocument.total += 1;

        // Guardar los cambios en la base de datos
        treeDocument.save()
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
}


module.exports = { getRecommendation, actualizarResultados };
