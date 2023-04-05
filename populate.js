/*
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
          archive BOOLEAN,
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
          PRIMARY KEY (idReservation),
          FOREIGN KEY (idChambre) REFERENCES chambre(idChambre),
          FOREIGN KEY (NASclient) REFERENCES client(NASclient)
        )
*/

const hotelChains = [
    "Marriott International",
    "Hilton Worldwide Holdings Inc.",
    "InterContinental Hotels Group (IHG)",
    "AccorHotels",
    "Wyndham Hotels & Resorts",
    "Choice Hotels International",
    "Best Western International",
    "Hyatt Hotels Corporation",
    "Radisson Hotel Group",
    "Motel 6"
];
const hotelJobs = [
    'Réceptionniste',
    'Groom',
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
    "Lit supplémentaire",
    "Canapé-lit",
    "Lit bébé",
    "Chaise haute"
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
    console.log('Connected to MySQL database');
  });

  function createHotelChains() {
    // Ajouter les chaînes hôtelières à la base de données
    hotelChains.forEach((chain) => {
      const query = `INSERT INTO chainehoteliere (nom, nombrehotel) VALUES (?, ?)`;
      const values = [chain, 0];
  
      db.query(query, values, (error, result) => {
        if (error) {
          console.error('Error inserting hotel chain:', error);
        } else {
          console.log(`Inserted hotel chain '${chain}' with ID ${result.insertId}`);
  
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
  
            db.query(bureauQuery, bureauValues, (error, result) => {
              if (error) {
                console.error('Error inserting bureau:', error);
              } else {
                console.log(`Inserted bureau with ID ${result.insertId}`);
              }
            });
          }
        }
      });
    });
  }
  function createHotels() {
    // Sélectionner toutes les chaînes hôtelières de la base de données
    const query = `SELECT * FROM chainehoteliere`;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error selecting hotel chains:', error);
      } else {
        results.forEach((chain) => {
          // Générer un nombre aléatoire d'hôtels pour la chaîne hôtelière
          const numHotels = Math.floor(Math.random() * 15) + 6; // entre 6 et 20 hôtels par chaîne
  
          for (let i = 0; i < numHotels; i++) {
            const nomHotel = faker.company.companyName();
            const classement = Math.floor(Math.random() * 6);
            const nombreChambres = Math.floor(Math.random() * 41) + 80; // entre 80 et 120 chambres par hôtel
            const rue = faker.address.streetAddress();
            const codePostal = faker.address.zipCode();
            const ville = faker.address.city();
            const email = faker.internet.email();
            const numeroTel = faker.phone.phoneNumber();
  
            const hotelQuery = `INSERT INTO hotel (nom, classement, nombrechambres, rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const hotelValues = [nomHotel, classement, nombreChambres, rue, codePostal, ville, email, numeroTel, chain.idchaine];
  
            db.query(hotelQuery, hotelValues, (error, result) => {
              if (error) {
                console.error('Error inserting hotel:', error);
              } else {
                console.log(`Inserted hotel '${nomHotel}' with ID ${result.insertId}`);
              }
            });
          }
        });
      }
    });
  } 
  function addRooms() {
    // Sélectionner tous les hôtels de la base de données
    const query = `SELECT * FROM hotel`;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error selecting hotels:', error);
      } else {
        results.forEach((hotel) => {
          // Générer un nombre aléatoire de chambres pour l'hôtel
          const numChambres = Math.floor(Math.random() * 80) + 41; // entre 41 et 120 chambres par hôtel
  
          for (let i = 0; i < numChambres; i++) {
            const prix = Math.floor(Math.random() * 201) + 50; // entre 50 et 250$ par nuit
            const capacite = Math.floor(Math.random() * 5) + 1; // entre 1 et 5 personnes
            const disponible = Math.random() < 0.8; // 80% de chance d'être disponible
            const vue = roomViews[Math.floor(Math.random() * roomViews.length)]; // une vue aléatoire
            const etendue = roomEtendue[Math.floor(Math.random() * roomEtendue.length)]; // une étendue aléatoire
            const probleme = Math.random() < 0.1; // 10% de chance d'avoir un problème
            
            const chambreQuery = `INSERT INTO chambre (prix, capaciteChambre, disponible, vue, etendue, problemechambre, idHotel) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const chambreValues = [prix, capacite, disponible, vue, etendue, probleme, hotel.idhotel];
  
            db.query(chambreQuery, chambreValues, (error, result) => {
              if (error) {
                console.error('Error inserting chambre:', error);
              } else {
                console.log(`Inserted chambre with ID ${result.insertId}`);
  
                // Ajouter des commodités aléatoires pour la chambre
                const numComodites = Math.floor(Math.random() * 6) + 1; // entre 1 et 6 commodités par chambre
  
                for (let j = 0; j < numComodites; j++) {
                  const comodite = comodites[Math.floor(Math.random() * comodites.length)];
  
                  const comoditeQuery = `INSERT INTO commodite (nom, idchambre) VALUES (?, ?)`;
                  const comoditeValues = [comodite, result.insertId];
  
                  db.query(comoditeQuery, comoditeValues, (error, result) => {
                    if (error) {
                      console.error('Error inserting commodite:', error);
                    } else {
                      console.log(`Inserted commodite with ID ${result.insertId}`);
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }
  function createEmployees() {
    // Sélectionner tous les hôtels de la base de données
    const query = `SELECT * FROM hotel`;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error selecting hotels:', error);
      } else {
        results.forEach((hotel) => {
          // Générer un nombre aléatoire d'employés pour l'hôtel
          const numEmployees = Math.floor(Math.random() * 6) + 5; // entre 5 et 10 employés par hôtel
  
          for (let i = 0; i < numEmployees; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const streetAddress = faker.address.streetAddress();
            const postalCode = faker.address.zipCode();
            const city = faker.address.city();
            const username = faker.internet.userName();
            const password = faker.internet.password();
            const role = hotelJobs[Math.floor(Math.random() * hotelJobs.length)];
  
            const employeeQuery = `INSERT INTO employe (NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const employeeValues = [faker.random.alphaNumeric(11), firstName, lastName, streetAddress, postalCode, city, username, password, hotel.idhotel];
  
            db.query(employeeQuery, employeeValues, (error, result) => {
              if (error) {
                console.error('Error inserting employee:', error);
              } else {
                console.log(`Inserted employee with NAS ${employeeValues[0]}`);
  
                // Créer un rôle pour cet employé
                const salary = Math.floor(Math.random() * 5001) + 500; // salaire entre 500$ et 5500$ par mois
                const roleQuery = `INSERT INTO role (nom, salaireDebut, idhotel, NASemploye) VALUES (?, ?, ?, ?)`;
                const roleValues = [role, salary, hotel.idhotel, employeeValues[0]];
  
                db.query(roleQuery, roleValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting role:', error);
                  } else {
                    console.log(`Inserted role with ID ${result.insertId}`);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  function addClients() {
    for (let i = 0; i < 15000; i++) {
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
  
      db.query(clientQuery, clientValues, (error, result) => {
        if (error) {
          console.error('Error inserting client:', error);
        } else {
          console.log(`Inserted client with NAS ${clientValues[0]}`);
        }
      });
    }
  }
  function populateLocation() {
    const hotelQuery = `SELECT idhotel FROM hotel`;
  
    db.query(hotelQuery, [], (error, hotels) => {
      if (error) {
        console.error('Error selecting hotels:', error);
        return;
      }
  
      hotels.forEach((hotel) => {
        const hotelId = hotel.idhotel;
        
        const roomQuery = `SELECT idChambre FROM chambre WHERE idHotel = ? ORDER BY RAND() LIMIT 10, 20`;
        const employeeQuery = `SELECT NASemploye FROM employe WHERE idhotel = ?`;
        const clientQuery = `SELECT NASclient FROM client ORDER BY RAND() LIMIT 1`;
  
        db.query(roomQuery, [hotelId], (error, rooms) => {
          if (error) {
            console.error('Error selecting rooms:', error);
            return;
          }
  
          db.query(employeeQuery, [hotelId], (error, employees) => {
            if (error) {
              console.error('Error selecting employees:', error);
              return;
            }
  
            for (let i = 0; i < 20; i++) {
              db.query(clientQuery, [], (error, clients) => {
                if (error) {
                  console.error('Error selecting clients:', error);
                  return;
                }
  
                const client = clients[0];
                const employee = employees[Math.floor(Math.random() * employees.length)];
                const room = rooms[Math.floor(Math.random() * rooms.length)];
  
                const checkInDate = faker.date.between('2017-01-01', '2024-12-31').toISOString().slice(0, 10);
                const checkOutDate = faker.date.between(checkInDate, '2024-12-31').toISOString().slice(0, 10);
                const paymentMethod = modesDePaiement[Math.floor(Math.random() * modesDePaiement.length)];
  
                const isArchived = new Date(checkInDate) < new Date('2023-01-01') ? 1 : 0;
  
                const locationQuery = `INSERT INTO loue (idChambre, NASclient, NASemploye, checkIndDate, checkOutDate, paiement, archive) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const locationValues = [room.idChambre, client.NASclient, employee.NASemploye, checkInDate, checkOutDate, paymentMethod, isArchived];
  
                db.query(locationQuery, locationValues, (error, result) => {
                  if (error) {
                    console.error('Error inserting location:', error);
                  } else {
                    console.log(`Inserted location with ID ${result.insertId}`);
                  }
                });
              });
            }
          });
        });
      });
    });
  }
  function populateReservations() {
    const hotelQuery = `SELECT idhotel FROM hotel`;
  
    db.query(hotelQuery, [], (error, hotels) => {
      if (error) {
        console.error('Error selecting hotels:', error);
        return;
      }
  
      hotels.forEach((hotel) => {
        const hotelId = hotel.idhotel;
        const roomQuery = `SELECT idChambre FROM chambre WHERE idHotel = ? ORDER BY RAND() LIMIT 10`;
  
        db.query(roomQuery, [hotelId], (error, rooms) => {
          if (error) {
            console.error('Error selecting rooms:', error);
            return;
          }
  
          const clientQuery = `SELECT NASclient FROM client ORDER BY RAND() LIMIT 10`;
  
          db.query(clientQuery, [], (error, clients) => {
            if (error) {
              console.error('Error selecting clients:', error);
              return;
            }
  
            for (let i = 0; i < rooms.length; i++) {
              const room = rooms[i];
              const client = clients[i];
  
              const checkInDate = faker.date.between('2023-04-01', '2024-12-31').toISOString().slice(0, 10);
              const checkOutDate = faker.date.between(checkInDate, '2024-12-31').toISOString().slice(0, 10);
  
              const reservationQuery = `INSERT INTO reserve (idChambre, NASclient, checkInDate, checkOutDate) VALUES (?, ?, ?, ?)`;
              const reservationValues = [room.idChambre, client.NASclient, checkInDate, checkOutDate];
  
              db.query(reservationQuery, reservationValues, (error, result) => {
                if (error) {
                  console.error('Error inserting reservation:', error);
                } else {
                  console.log(`Inserted reservation with ID ${result.insertId}`);
                }
              });
            }
          });
        });
      });
    });
  }
  
  // Function to count hotels for each chain and update the count in the database
function updateChainHotelCount() {
    const query = `
      SELECT chainehoteliere.idchaine, COUNT(hotel.idhotel) AS hotelCount
      FROM chainehoteliere
      LEFT JOIN hotel ON chainehoteliere.idchaine = hotel.idchaine
      GROUP BY chainehoteliere.idchaine
    `;
    
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error counting hotels for chains:', error);
      } else {
        results.forEach((result) => {
          const chainId = result.idchaine;
          const hotelCount = result.hotelCount;
          
          const updateQuery = `
            UPDATE chainehoteliere
            SET nombrehotel = ?
            WHERE idchaine = ?
          `;
          
          const updateValues = [hotelCount, chainId];
          
          db.query(updateQuery, updateValues, (error, result) => {
            if (error) {
              console.error(`Error updating hotel count for chain ID ${chainId}:`, error);
            } else {
              console.log(`Updated hotel count for chain ID ${chainId} to ${hotelCount}`);
            }
          });
        });
      }
    });
  }
  
  // Function to count rooms for each hotel and update the count in the database
function updateHotelRoomCount() {
    const query = `
      SELECT hotel.idhotel, COUNT(chambre.idChambre) AS roomCount
      FROM hotel
      LEFT JOIN chambre ON hotel.idhotel = chambre.idHotel
      GROUP BY hotel.idhotel
    `;
    
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error counting rooms for hotels:', error);
      } else {
        results.forEach((result) => {
          const hotelId = result.idhotel;
          const roomCount = result.roomCount;
          
          const updateQuery = `
            UPDATE hotel
            SET nombrechambres = ?
            WHERE idhotel = ?
          `;
          
          const updateValues = [roomCount, hotelId];
          
          db.query(updateQuery, updateValues, (error, result) => {
            if (error) {
              console.error(`Error updating room count for hotel ID ${hotelId}:`, error);
            } else {
              console.log(`Updated room count for hotel ID ${hotelId} to ${roomCount}`);
            }
          });
        });
      }
    });
  }
  
  
//createHotelChains()
//createHotels()
//addRooms()
//createEmployees()
//addClients()
//populateLocation();
 //populateReservations();

