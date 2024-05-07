// // Función para verificar cada caso del árbol
// function runTestCases() {
//     const testCases = [
//       // Para la rama "<15000"
//       { answers: ["<15000", "si"], expected: "Las Fuentes (6-A, 6-B)" },
//       { answers: ["<15000", "no"], expected: "Delicias (3-A) (3-D)" },
  
//       // Para la rama "15000-25000"
//       { answers: ["15000-25000", "si"], expected: "Garrapinillos (12)" },
//       { answers: ["15000-25000", "no", "no"], expected: "El casco (1-A, 1-B)" },
//       { answers: ["15000-25000", "no", "si"], expected: "Torrero (9 - Parque Venecia)" },
  
//       // Para la rama "25000-40000"
//       { answers: ["25000-40000", "si"], expected: "Santa Isabel (11 - Zorongo)" },
//       { answers: ["25000-40000", "no", "si", "si"], expected: "Parque Venecia (9)" },
//       { answers: ["25000-40000", "no", "si", "no"], expected: "Miralbueno (8-B)" },
//       { answers: ["25000-40000", "no", "no"], expected: "Arrabla/Almozara (10-C, 10-E, 10-F)" },
  
//       // Para la rama "40000-75000"
//       { answers: ["40000-75000", "si", "si"], expected: "Montecanal (4-D Solamente Montecanal y Argualas)" },
//       { answers: ["40000-75000", "si", "no"], expected: "Cuarte" },
//       { answers: ["40000-75000", "no", "si"], expected: "Actur (10-A, 10-B)" },
//       { answers: ["40000-75000", "no", "no"], expected: "Valdefierro (8-A)" },
  
//       // Para la rama ">75000"
//       { answers: [">75000", "si", "tranquilo"], expected: "Urbanización Zorongo (11)" },
//       { answers: [">75000", "si", "actividad"], expected: "Barrio Casablanca (4-C)" },
//       { answers: [">75000", "no", "si_practico", "grandes_parques"], expected: "Barrio Romareda (4-C)" },
//       { answers: [">75000", "no", "si_practico", "no_parques"], expected: "Barrio Centro (2-D, 2-C)" },
//       { answers: [">75000", "no", "no_practico", "si"], expected: "Barrio Romareda (4-C)" },
//       { answers: [">75000", "no", "no_practico", "no"], expected: "Barrio Centro (2-D, 2-C)" },
//     ];
  
//     let passed = true;
//     for (const testCase of testCases) {
//       const recommendation = getRecommendation(testCase.answers);
//       if (recommendation !== testCase.expected) {
//         console.log(`Falló para [${testCase.answers.join(', ')}]: Se esperaba "${testCase.expected}", pero se obtuvo "${recommendation}"`);
//         passed = false;
//       }
//     }
//     if (passed) {
//       console.log("¡Todos los casos de prueba pasaron exitosamente!");
//     }
//   }
  
//   // // Ejecutar las pruebas
//   runTestCases();

const { getRecommendation } = require('./tree');

// Vector de respuestas. OJO QUE HAY RESPUESTAS QUE NO SON DE SI/NO. EL CASO DE >75000 TIENE DE ESE TIPO!!!
const responses = ["si", "si", "si", "si", "si", "si", "si", "estudiante", "si", "si", "si", "si", "no", "no", "no", "si"];

const recommendation = getRecommendation(responses);
console.log("Recomendación de barrio:", recommendation);


