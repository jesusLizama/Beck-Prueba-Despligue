const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../index');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

describe('API de Actividades', () => {
  describe('GET /actividades', () => {
    it('debería obtener la lista de actividades', (done) => {
      chai.request(app)
        .get('/activities')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200); 
          done();
        });
    });
  });
});

describe('API de Usuarios', () => {
  describe('POST /usuarios', () => {
    it('debería crear un usuario correctamente', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          email: 'test@example.com',
          password: 'password',
          nombre: 'Test',
          apellidos: 'User',
          telefono: '1234567892',
          nickname: 'testuser2'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
  });
});


describe('API de Recomendación de Barrio', () => {
  describe('POST /recomendacion', () => {
    it('debería obtener una recomendación de barrio igual a Casablanca', (done) => {
      // Suponiendo que tienes un usuario registrado en tu base de datos con estas credenciales
      const credentials = {
        email: 'test@example.com',
        password: 'password'
      };

      // Realizar el inicio de sesión para obtener el token
      chai.request(app)
        .post('/login')
        .send(credentials)
        .end((err, res) => {
          try {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');

            const token = res.body.token;

            // Ahora que tenemos el token, hacemos la solicitud a la ruta protegida
            const mockResponses = [
              "si", "si", "si", "si", "no", "si", "si", ">75000", "si", "si", "si", "si", "no", "no", "no", "si"
            ];

            chai.request(app)
              .post('/recomendacion')
              .set('Authorization', `Bearer ${token}`) // Establecemos el token en el encabezado de autorización
              .send({ responses: mockResponses })
              .end((err, res) => {
                try {
                  expect(err).to.be.null;
                  expect(res).to.have.status(200);
                  // Verificar que la respuesta es un string no vacío
                  expect(res.text).to.be.a('string').that.is.not.empty;
                  // Verificar que la recomendación es la esperada
                  expect(res.text).to.equal('66151d0acc0535e96a0e7ad1'); // Suponiendo que esperas este valor
                  done();
                } catch (error) {
                  done(error);
                }
              });
          } catch (error) {
            done(error);
          }
        });
    });
  });
});

describe('API de Colegios', () => {
  let authToken; // Variable para almacenar el token de autenticación

  // Test para crear un nuevo colegio
  describe('POST /colegio', () => {
    it('debería crear un nuevo colegio para el usuario', (done) => {
      // Suponiendo que tienes un usuario registrado en tu base de datos con estas credenciales
      const credentials = {
        email: 'admin@admin.com',
        password: '5edfa2692bdacc5e6ee805c626c50cb44cebb065f092d9a1067d89f74dacd326'
      };

      // Realizar el inicio de sesión para obtener el token
      chai.request(app)
        .post('/login')
        .send(credentials)
        .end((err, res) => {
          try {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');

            authToken = res.body.token; // Guardamos el token para usarlo en las solicitudes posteriores

            // Datos del nuevo colegio
            const colegioData = {
              nombre: 'Colegio de prueba Esmegmun',
              descripcion: 'Este es un colegio de prueba',
              calle: 'Calle del colegio de prueba 123',
              telefono: '12345456'
            };

            // Creamos un nuevo colegio
            chai.request(app)
              .post('/colegio')
              .set('Authorization', `Bearer ${authToken}`) // Establecemos el token en el encabezado de autorización
              .send(colegioData)
              .end((err, res) => {
                try {
                  expect(err).to.be.null;
                  expect(res).to.have.status(201);
                  done();
                } catch (error) {
                  done(error);
                }
              });
          } catch (error) {
            done(error);
          }
        });
    });
  });

  // Test para verificar que el colegio se ha creado correctamente
  describe('GET /colegio', () => {
    it('debería obtener el nuevo colegio creado', (done) => {
      // Suponiendo que tienes un usuario registrado en tu base de datos con estas credenciales
      const credentials = {
        email: 'admin@admin.com',
        password: '5edfa2692bdacc5e6ee805c626c50cb44cebb065f092d9a1067d89f74dacd326'
      };

      // Realizar el inicio de sesión para obtener el token
      chai.request(app)
        .post('/login')
        .send(credentials)
        .end((err, res) => {
          try {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');

            authToken = res.body.token; // Guardamos el token para usarlo en las solicitudes posteriores

            // Hacemos una solicitud GET para obtener todos los colegios del usuario
            chai.request(app)
              .get('/colegio')
              .set('Authorization', `Bearer ${authToken}`) // Establecemos el token en el encabezado de autorización
              .end((err, res) => {
                try {
                  expect(err).to.be.null;
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array').that.is.not.empty;

                  // Verificamos que el nuevo colegio esté presente en la lista de colegios del usuario
                  const newColegio = res.body.find(colegio => colegio.nombre === 'Colegio de prueba Esmegmun');
                  expect(newColegio).to.exist;

                  done();
                } catch (error) {
                  done(error);
                }
              });
          } catch (error) {
            done(error);
          }
        });
    });
  });
});
