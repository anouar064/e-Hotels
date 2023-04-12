/*
rappel/reminder tables
 chainehoteliere (
        idchaine INTEGER AUTO_INCREMENT,
        nom VARCHAR(255) UNIQUE,
        nombrehotel INTEGER,
        PRIMARY KEY (idchaine)
      )
    Bureau (
        idBureau INTEGER AUTO_INCREMENT,
        rue VARCHAR(255),
        codePostal VARCHAR(10),
        ville VARCHAR(255),
        email VARCHAR(255),
        numeroTel VARCHAR(255),
        idchaine INTEGER,
        PRIMARY KEY (idBureau),
        FOREIGN KEY (idchaine) REFERENCES chainehoteliere(idchaine)
      )
    hotel (
          idhotel INTEGER AUTO_INCREMENT,
          nom VARCHAR(255),
          classement INTEGER CHECK (classement >= 0 AND classement <= 5),
          nombrechambres INTEGER,
          rue VARCHAR(255),
          codePostal VARCHAR(10),
          ville VARCHAR(255),
          email VARCHAR(255),
          numeroTel VARCHAR(255),
          idchaine INTEGER,
          PRIMARY KEY (idhotel),
          FOREIGN KEY (idchaine) REFERENCES chainehoteliere(idchaine)
        )
    chambre (
          idChambre INTEGER AUTO_INCREMENT,
          prix INTEGER,
          capaciteChambre INTEGER,
          disponible BOOLEAN,
          vue VARCHAR(255),
          etendue VARCHAR(255),
          problemechambre BOOLEAN,
          idHotel INTEGER,
          PRIMARY KEY (idChambre),
          FOREIGN KEY (idHotel) REFERENCES hotel(idhotel)
        )
    commodite (
          idcomodite INTEGER AUTO_INCREMENT,
          nom VARCHAR(255),
          idchambre INTEGER,
          PRIMARY KEY (idcomodite),
          FOREIGN KEY (idchambre) REFERENCES chambre(idChambre)
        )
    employe (
          NASemploye VARCHAR(255) PRIMARY KEY,
          prenom VARCHAR(255),
          nomFamille VARCHAR(255),
          rue VARCHAR(255),
          codePostal VARCHAR(10),
          ville VARCHAR(255),
          username VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          idhotel INTEGER,
          FOREIGN KEY (idhotel) REFERENCES hotel(idhotel)
        )
    role (
          idrole INTEGER PRIMARY KEY AUTO_INCREMENT,
          nom VARCHAR(255),
          salaireDebut DECIMAL(10, 2),
          idhotel INTEGER,
          NASemploye VARCHAR(255),
          FOREIGN KEY (idhotel) REFERENCES hotel(idhotel),
          FOREIGN KEY (NASemploye) REFERENCES employe(NASemploye)
        )
        loue (
          idLocation INTEGER AUTO_INCREMENT, 
          idChambre INTEGER,
          NASclient VARCHAR(255),
          NASemploye VARCHAR(255),
          checkIndDate DATE,
          checkOutDate DATE,
          paiement VARCHAR(255),
          PRIMARY KEY (idLocation),
          archive BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (idChambre) REFERENCES chambre(idChambre),
          FOREIGN KEY (NASclient) REFERENCES client(NASclient),
          FOREIGN KEY (NASemploye) REFERENCES employe(NASemploye)
        )
        client (
          NASclient VARCHAR(255) PRIMARY KEY,
          prenom VARCHAR(255),
          nomFamille VARCHAR(255),
          rue VARCHAR(255),
          codePostal VARCHAR(10),
          ville VARCHAR(255),
          dateEnregistrement DATE,
          username VARCHAR(255) ,
          password VARCHAR(255)
        )
        reserve (
          idReservation INTEGER AUTO_INCREMENT,
          idChambre INTEGER,
          NASclient VARCHAR(255),
          checkInDate DATE,
          checkOutDate DATE,
           archive BOOLEAN DEFAULT FALSE,

          PRIMARY KEY (idReservation),
          FOREIGN KEY (idChambre) REFERENCES chambre(idChambre),
          FOREIGN KEY (NASclient) REFERENCES client(NASclient)
        )
*/

const hotelChains = [
    "Marriott International",
    "AccorHotels",
    "Hotel California",
    "Hyatt Hotels Corporation",
    "Motel 6"
];
const hotelJobs = [
    'Réceptionniste',
    'Bagagiste',
    'Maître d\'hôtel',
    'Serveur',
    'Barman',
    'Chef de cuisine',
    'Cuisinier',
    'Pâtissier',
    'Responsable des achats',
    'Responsable des ressources humaines',
    'Comptable',
    'Assistant de direction',
    'Technicien de maintenance',
  ];
const comodites = [
    "Télévision",
    "Air conditionné",
    "Réfrigérateur",
    "Micro-ondes",
    "Coffre-fort",
    "Sèche-cheveux",
    "Fer à repasser",
    "Service de chambre",
    "Petit-déjeuner inclus",
    "Accès Internet haut débit",
    "Piscine",
    "Spa",
    "Salle de sport",
    "Restaurant sur place",
    "Bar/salon",
    "Parking gratuit",
    "Navette aéroport",
    "Animaux de compagnie acceptés",
    "Réception ouverte 24h/24",
    "Blanchisserie",
    "Centre d'affaires",
    "Salles de réunion",
    "Service de conciergerie",
    "Bureau dans la chambre"
];
  const roomViews = [
    "Vue sur la mer",
    "Vue sur la montagne",
    "Vue sur la ville",
    "Vue sur le jardin"
  ];
  const roomEtendue = [
    "Grande",
    "Moyenne",
    "Petite",
  ];
  const modesDePaiement = [
    "Virement bancaire",
    "Prélèvement automatique",
    "Cartes prépayées",
    "Paiements par portefeuille électronique (ex: PayPal, Google Pay)",
    "Chèques bancaires certifiés",
    "Paiements en crypto-monnaie (ex: Bitcoin, Ethereum)",
    "Paiement en espèces",
    "Carte de crédit",
    "Carte de débit",
    "Non payé"
  ];
const mysql = require('mysql');
const { faker } = require('@faker-js/faker');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ehotel',
  port: 3306,
});

db.connect((err) => {
    if (err) {
      console.error(`Error connecting to MySQL: ${err.message}`);
      return;
    }
    //console.log('Connected to MySQL database');
  });

  function createHotelChains() {
    // Ajouter les chaînes hôtelières à la base de données
    const promises = hotelChains.map((chain) => {
      const query = `INSERT INTO chainehoteliere (nom, nombrehotel) VALUES (?, ?)`;
      const values = [chain, 0];
  
      return new Promise((resolve, reject) => {
        db.query(query, values, async (error, result) => {
          if (error) {
            console.error('Error inserting hotel chain:', error);
            reject(error);
          } else {
            const bureauPromises = [];
  
            // Générer des adresses de bureaux aléatoires pour la chaîne hôtelière
            const numBureaux = Math.floor(Math.random() * 2) + 2; // entre 2 et 3 bureaux par chaîne
            for (let i = 0; i < numBureaux; i++) {
              const bureau = faker.address.streetAddress();
              const ville = faker.address.city();
              const codePostal = faker.address.zipCode();
              const email = faker.internet.email();
              const numeroTel = faker.phone.number();
  
              const bureauQuery = `INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)`;
              const bureauValues = [bureau, codePostal, ville, email, numeroTel, result.insertId];
  
              const bureauPromise = new Promise((resolve, reject) => {
                db.query(bureauQuery, bureauValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting bureau:', error);
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              });
  
              bureauPromises.push(bureauPromise);
            }
  
            await Promise.all(bureauPromises);
            resolve();
          }
        });
      });
    });
  
    return Promise.all(promises);
  }
  
  function createHotels() {
    const query = `SELECT * FROM chainehoteliere`;
  
    return new Promise((resolve, reject) => {
      db.query(query, async (error, results) => {
        if (error) {
          console.error('Error selecting hotel chains:', error);
          reject(error);
        } else {
          const hotelPromises = results.map((chain) => {
            // Générer un nombre aléatoire d'hôtels pour la chaîne hôtelière
            const numHotels = Math.floor(Math.random() * 15) + 6; // entre 6 et 20 hôtels par chaîne
  
            const chainPromises = [];
  
            for (let i = 0; i < numHotels; i++) {
              const nomHotel = faker.company.name();
              const classement = Math.floor(Math.random() * 6);
              const nombreChambres = Math.floor(Math.random() * 41) + 80; // entre 80 et 120 chambres par hôtel
              const rue = faker.address.streetAddress();
              const codePostal = faker.address.zipCode();
              const ville = faker.address.city();
              const email = faker.internet.email();
              const numeroTel = faker.phone.number();
  
              const hotelQuery = `INSERT INTO hotel (nom, classement, nombrechambres, rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              const hotelValues = [nomHotel, classement, nombreChambres, rue, codePostal, ville, email, numeroTel, chain.idchaine];
  
              const hotelPromise = new Promise((resolve, reject) => {
                db.query(hotelQuery, hotelValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting hotel:', error);
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              });
  
              chainPromises.push(hotelPromise);
            }
  
            return Promise.all(chainPromises);
          });
  
          await Promise.all(hotelPromises);
          resolve();
        }
      });
    });
  }
  


  function addRooms() {
    const query = `SELECT * FROM hotel`;
  
    return new Promise((resolve, reject) => {
      db.query(query, async (error, results) => {
        if (error) {
          console.error('Error selecting hotels:', error);
          reject(error);
        } else {
          const roomPromises = results.map((hotel) => {
            const numChambres = Math.floor(Math.random() * 50) + 41; // entre 41 et 120 chambres par hôtel
  
            const hotelPromises = [];
  
            for (let i = 0; i < numChambres; i++) {
              const prix = Math.floor(Math.random() * 1451) + 50; // entre 50 et 1500$
              const capacite = Math.floor(Math.random() * 5) + 1; // entre 1 et 5 personnes
              const disponible = Math.random() < 0.7; // 80% de chance d'être disponible
              const vue = roomViews[Math.floor(Math.random() * roomViews.length)]; // une vue aléatoire
              const etendue = roomEtendue[Math.floor(Math.random() * roomEtendue.length)]; // une étendue aléatoire
              const probleme = Math.random() < 0.1; // 10% de chance d'avoir un problème
  
              const chambreQuery = `INSERT INTO chambre (prix, capaciteChambre, disponible, vue, etendue, problemechambre, idHotel) VALUES (?, ?, ?, ?, ?, ?, ?)`;
              const chambreValues = [prix, capacite, disponible, vue, etendue, probleme, hotel.idhotel];
  
              const roomPromise = new Promise((resolve, reject) => {
                db.query(chambreQuery, chambreValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting chambre:', error);
                    reject(error);
                  } else {
                    const numComodites =3; // entre 1 et 6 commodités par chambre
  
                    const comoditePromises = [];
  
                    for (let j = 0; j < numComodites; j++) {
                      const comodite = comodites[Math.floor(Math.random() * comodites.length)];
  
                      const comoditeQuery = `INSERT INTO commodite (nom, idchambre) VALUES (?, ?)`;
                      const comoditeValues = [comodite, result.insertId];
  
                      const comoditePromise = new Promise((resolve, reject) => {
                        db.query(comoditeQuery, comoditeValues, (error, result) => {
                          if (error) {
                            console.error('Error inserting commodite:', error);
                            reject(error);
                          } else {
                            resolve();
                          }
                        });
                      });
  
                      comoditePromises.push(comoditePromise);
                    }
  
                    Promise.all(comoditePromises).then(() => resolve()).catch((error) => reject(error));
                  }
                });
              });
  
              hotelPromises.push(roomPromise);
            }
  
            return Promise.all(hotelPromises);
          });
  
          await Promise.all(roomPromises);
          resolve();
        }
      });
    });
  }
  
  
  function createEmployees() {
    const query = `SELECT * FROM hotel`;
  
    return new Promise((resolve, reject) => {
      db.query(query, async (error, results) => {
        if (error) {
          console.error('Error selecting hotels:', error);
          reject(error);
        } else {
          const employeePromises = results.map((hotel) => {
            const numEmployees = Math.floor(Math.random() * 6) + 5; // entre 5 et 10 employés par hôtel
  
            const hotelPromises = [];
  
            for (let i = 0; i < numEmployees; i++) {
              const firstName = faker.name.firstName();
              const lastName = faker.name.lastName();
              const streetAddress = faker.address.streetAddress();
              const postalCode = faker.address.zipCode();
              const city = faker.address.city();
              const uniqueSuffix = faker.random.alphaNumeric(3);
  
              const username = faker.internet.userName() + uniqueSuffix;
              const password = faker.internet.password();
              const role = hotelJobs[Math.floor(Math.random() * hotelJobs.length)];
  
              const employeeQuery = `INSERT INTO employe (NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              const employeeValues = [faker.random.alphaNumeric(11), firstName, lastName, streetAddress, postalCode, city, username, password, hotel.idhotel];
  
              const employeePromise = new Promise((resolve, reject) => {
                db.query(employeeQuery, employeeValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting employee:', error);
                    reject(error);
                  } else {
                    const salary = Math.floor(Math.random() * 5001) + 500; // salaire entre 500$ et 5500$ par mois
                    const roleQuery = `INSERT INTO role (nom, salaireDebut, idhotel, NASemploye) VALUES (?, ?, ?, ?)`;
                    const roleValues = [role, salary, hotel.idhotel, employeeValues[0]];
  
                    db.query(roleQuery, roleValues, (error, result) => {
                      if (error) {
                        console.error('Error inserting role:', error);
                        reject(error);
                      } else {
                        resolve();
                      }
                    });
                  }
                });
              });
  
              hotelPromises.push(employeePromise);
            }
  
            return Promise.all(hotelPromises);
          });
  
          await Promise.all(employeePromises);
          resolve();
        }
      });
    });
  }
  
  
  function addClients() {
    return new Promise((resolve, reject) => {
      const clientPromises = [];
  
      for (let i = 0; i < 4000; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const streetAddress = faker.address.streetAddress();
        const postalCode = faker.address.zipCode();
        const city = faker.address.city();
        const username = faker.internet.userName();
        const password = faker.internet.password();
        const dateEnregistrement = faker.date.past();
    
        const clientQuery = `INSERT INTO client (NASclient, prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const clientValues = [faker.random.numeric(11), firstName, lastName, streetAddress, postalCode, city, dateEnregistrement, username, password];
      
        const clientPromise = new Promise((resolve, reject) => {
          db.query(clientQuery, clientValues, (error, result) => {
            if (error) {
              console.error('Error inserting client:', error);
              reject(error);
            } else {
              resolve();
            }
          });
        });
  
        clientPromises.push(clientPromise);
      }
  
      Promise.all(clientPromises)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
  



  function populateLocation() {
    const expiredReservationsQuery = `
      SELECT *
      FROM reserve
      WHERE checkInDate <= CURDATE() 
    `;
  
    db.query(expiredReservationsQuery, [], (error, reservations) => {
      if (error) {
        console.error('Error selecting expired reservations:', error);
        return;
      }
  
      reservations.forEach((reservation) => {
        const employeeQuery = `
          SELECT NASemploye
          FROM employe
          WHERE idhotel = (
            SELECT idhotel
            FROM chambre
            WHERE idChambre = ?
          )
        `;
  
        db.query(employeeQuery, [reservation.idChambre], (error, employees) => {
          if (error) {
            console.error('Error selecting employees:', error);
            return;
          }
  
          const employee = employees[Math.floor(Math.random() * employees.length)];
          const paymentMethod = modesDePaiement[Math.floor(Math.random() * modesDePaiement.length)];
  
          const locationQuery = `
            INSERT INTO loue (idChambre, NASclient, NASemploye, checkIndDate, checkOutDate, paiement, archive)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const locationValues = [
            reservation.idChambre,
            reservation.NASclient,
            employee.NASemploye,
            reservation.checkInDate,
            reservation.checkOutDate,
            paymentMethod,
            1
          ];
  
          db.query(locationQuery, locationValues, (error, result) => {
            if (error) {
              console.error('Error inserting location:', error);
            } else {
              console.log(`Inserted location with ID ${result.insertId}`);
  
              const archiveReservationQuery = `
                UPDATE reserve
                SET archive = TRUE
                WHERE idReservation = ?
              `;
  
              db.query(archiveReservationQuery, [reservation.idReservation], (error, result) => {
                if (error) {
                  console.error('Error archiving reservation:', error);
                } else {
                  console.log(`Archived reservation with ID ${reservation.idReservation}`);
                }
              });
            }
          });
        });
      });
    });
  }
  
  function populateReservations() {
    return new Promise((resolve, reject) => {
      const hotelQuery = `SELECT idhotel FROM hotel`;
  
      db.query(hotelQuery, [], async (error, hotels) => {
        if (error) {
          console.error('Error selecting hotels:', error);
          reject(error);
          return;
        }
  
        const hotelPromises = hotels.map(async (hotel) => {
          const hotelId = hotel.idhotel;
          const roomQuery = `SELECT idChambre FROM chambre WHERE idHotel = ? ORDER BY RAND() LIMIT 20`;
  
          return new Promise((resolve, reject) => {
            db.query(roomQuery, [hotelId], (error, rooms) => {
              if (error) {
                console.error('Error selecting rooms:', error);
                reject(error);
                return;
              }
  
              const clientQuery = `SELECT NASclient FROM client ORDER BY RAND() LIMIT 20`;
              db.query(clientQuery, [], (error, clients) => {
                if (error) {
                  console.error('Error selecting clients:', error);
                  reject(error);
                  return;
                }

                const reservationPromises = rooms.map((room, i) => {
                  const client = clients[i];
  
                  const checkInDate = faker.date.between('2014-01-01', '2024-12-31').toISOString().slice(0, 10);
                  const checkOutDate = faker.date.between(checkInDate, new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 15)).toISOString().slice(0, 10);
  
                  const reservationQuery = `INSERT INTO reserve (idChambre, NASclient, checkInDate, checkOutDate) VALUES (?, ?, ?, ?)`;
                  const reservationValues = [room.idChambre, client.NASclient, checkInDate, checkOutDate];
  
                  return new Promise((resolve, reject) => {

                    db.query(reservationQuery, reservationValues, (error, result) => {
                      if (error) {
                        console.error('Error inserting reservation:', error);
                        reject(error);
                      } else {
                        resolve();
                      }
                    });
                  });
                });
  
                Promise.all(reservationPromises)
                  .then(() => resolve())
                  .catch((error) => reject(error));
              });
            });
          });
        });
  
        try {
          await Promise.all(hotelPromises);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  
  async function runSeeder() {
    try {
      await createHotelChains();
      console.log('Hotel chains created.');
  
      await createHotels();
      console.log('Hotels created.');
      console.log('Creation de Rooms... ( peut prendre du temps 1-2min...) ');
  
      await addRooms();
      console.log('Rooms added.');
  
      await createEmployees();
      console.log('Employees created.');
  
      await addClients();
      console.log('Clients added.');
  
      
  
       await populateReservations();
       console.log('Reservations populated.');
  
      console.log('Database seeding completed.');
    } catch (error) {
      console.error('Error during database seeding:', error);
    } finally {
      db.end(); // Close the database connection
    }
  }

  //Lancer le script en 2 etapes : 


//-------------------------
  //Etape I
  //Creation de Chaine-Hotel-Chambre-commodite-employe-client-reservation
//-------------------------
    
  //runSeeder();
//-------------------------
  //Etape II
  //Creation Location
//-------------------------
  
  populateLocation();
