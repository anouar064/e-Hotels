const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const cors = require('cors');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306
});

//=====Fonction d'initialisation de la DB ainsi que des tables=======

function initDB() {
  db.connect((error) => {
    if (error) {
      console.error('Error connecting to MySql:', error);
      return;
    }

    db.query('CREATE DATABASE IF NOT EXISTS ehotel', (err) => {
      if (err) {
        console.error('Error creating database:', err);
        return;
      }
      console.log('> Databasebase ehotel created or already exists');
      db.changeUser({ database: 'ehotel' }, (err) => {
        if (err) {
          console.error('Error selecting database:', err);
          return;
        }
        console.log('> Databasebase ehotel selected');

      });
    });
  });

  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ehotel',

    port: 3306
  });
}


function initTable() {
  const createChainehoteliereTable = `CREATE TABLE IF NOT EXISTS chainehoteliere (
      idchaine INTEGER AUTO_INCREMENT,
      nom VARCHAR(255) UNIQUE,
      nombrehotel INTEGER,
      PRIMARY KEY (idchaine)
    )`;

  const createBureauTable = `CREATE TABLE IF NOT EXISTS Bureau (
      idBureau INTEGER AUTO_INCREMENT,
      rue VARCHAR(255),
      codePostal VARCHAR(10),
      ville VARCHAR(255),
      email VARCHAR(255),
      numeroTel VARCHAR(255),
      idchaine INTEGER,
      PRIMARY KEY (idBureau),
      FOREIGN KEY (idchaine) REFERENCES chainehoteliere(idchaine)
    )`;

  const createHotel = `CREATE TABLE IF NOT EXISTS hotel (
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
      )`;

  const createChambre = `CREATE TABLE IF NOT EXISTS chambre (
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
      )`;

  const createCommodite = `CREATE TABLE IF NOT EXISTS commodite (
        idcomodite INTEGER AUTO_INCREMENT,
        nom VARCHAR(255),
        idchambre INTEGER,
        PRIMARY KEY (idcomodite),
        FOREIGN KEY (idchambre) REFERENCES chambre(idChambre)
      )`;

  const createEmployeTable = `CREATE TABLE IF NOT EXISTS employe (
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
      )`;

  const createRoleTable = `CREATE TABLE IF NOT EXISTS role (
        idrole INTEGER PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255),
        salaireDebut DECIMAL(10, 2),
        idhotel INTEGER,
        NASemploye VARCHAR(255),
        FOREIGN KEY (idhotel) REFERENCES hotel(idhotel),
        FOREIGN KEY (NASemploye) REFERENCES employe(NASemploye)
      )`;

      const createLoueTable = `CREATE TABLE IF NOT EXISTS loue (
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
      )`;
      

      const createClientTable = `CREATE TABLE IF NOT EXISTS client (
        NASclient VARCHAR(255) PRIMARY KEY,
        prenom VARCHAR(255),
        nomFamille VARCHAR(255),
        rue VARCHAR(255),
        codePostal VARCHAR(10),
        ville VARCHAR(255),
        dateEnregistrement DATE,
        username VARCHAR(255) ,
        password VARCHAR(255)
      )`;
      
      
   

      const createReserveTable = `CREATE TABLE IF NOT EXISTS reserve (
        idReservation INTEGER AUTO_INCREMENT,
        idChambre INTEGER,
        NASclient VARCHAR(255),
        checkInDate DATE,
        checkOutDate DATE,
        PRIMARY KEY (idReservation),
        FOREIGN KEY (idChambre) REFERENCES chambre(idChambre),
        FOREIGN KEY (NASclient) REFERENCES client(NASclient)
      )`;
      
      

      
  db.query(createChainehoteliereTable, (err) => {
    if (err) {
      console.error('Error creating chainehoteliere table:', err);
      return;
    }
    console.log('> Table chainehoteliere created or already exists');
  });

  db.query(createBureauTable, (err) => {
    if (err) {
      console.error('Error creating Bureau table:', err);
      return;
    }
    console.log('> Table Bureau created or already exists');
  });

  db.query(createHotel, (err) => {
    if (err) {
      console.error('Error creating Hotel table:', err);
      return;
    }
    console.log('> Table Hotel created or already exists');
  });
  db.query(createChambre, (err) => {
    if (err) {
      console.error('Error creating Chambre table:', err);
      return;
    }
    console.log('> Table Chambre created or already exists');
  });

  db.query(createCommodite, (err) => {
    if (err) {
      console.error('Error creating Commodite table:', err);
      return;
    }
    console.log('> Table Commodite created or already exists');
  });


  db.query(createEmployeTable, (err) => {
    if (err) {
      console.error('Error creating Employe table:', err);
      return;
    }
    console.log('> Table Employe created or already exists');
  });

  db.query(createRoleTable, (err) => {
    if (err) {
      console.error('Error creating Role table:', err);
      return;
    }
    console.log('> Table Role created or already exists');
  });

  db.query(createLoueTable, (err) => {
    if (err) {
      console.error('Error creating loue table:', err);
      return;
    }
    console.log('> Table loue created or already exists');
  });
  
  db.query(createReserveTable, (err) => {
    if (err) {
      console.error('Error creating reserve table:', err);
      return;
    }
    console.log('> Table reserve created or already exists');
  });
  


  db.query(createClientTable, (err) => {
    if (err) {
      console.error('Error creating client table:', err);
      return;
    }
    console.log('> Table client created or already exists');
  });
  





}


//========Fonction pour ajouter-Modfier-Receercher-Supprimer :=========

// Fonctions  ChaineHoteliere : 
function addChainehoteliereAndBureau(nom, nombrehotel, rue, codePostal, ville, email, numeroTel) {
  // First insert the new record into the chainehoteliere table
  nombrehotel = 0
  const insertChainehoteliereQuery = 'INSERT INTO chainehoteliere (nom, nombrehotel) VALUES (?, ?)';
  db.query(insertChainehoteliereQuery, [nom, nombrehotel], (err, results) => {
    if (err) {
      console.error('Error adding record to chainehoteliere:', err);
      return;
    }
    //  console.log(`> New record added to chainehoteliere with ID ${results.insertId}`);
    // Once the chainehoteliere record is inserted, insert the new record into the Bureau table
    const insertBureauQuery = 'INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertBureauQuery, [rue, codePostal, ville, email, numeroTel, results.insertId], (err, results) => {
      if (err) {
        console.error('Error adding record to Bureau:', err);
        return;
      }
      //    console.log(`> New record added to Bureau with ID ${results.insertId}`);
    });
  });
}


function addBureauToChainehoteliere(idchaine, rue, codePostal, ville, email, numeroTel) {
  const insertBureauQuery = 'INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, (SELECT idchaine FROM chainehoteliere WHERE idchaine  = ?))';
  db.query(insertBureauQuery, [rue, codePostal, ville, email, numeroTel, idchaine], (err, results) => {
    if (err) {
      console.error('Error adding record to Bureau:', err);
      return;
    }
    //  console.log(`> New record added to Bureau with ID ${results.insertId}`);
  });
}


function getChainesAndBureaux() {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT ch.nom AS nomChaine, ch.nombrehotel, b.rue, b.codePostal, b.ville, b.email, b.numeroTel
        FROM chainehoteliere ch
        JOIN Bureau b ON ch.idchaine = b.idchaine
      `;
    db.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function getAllChainesHotellieres() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM chainehoteliere';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error getting chaines hotellieres:', err);
        reject(err);
        return;
      }
      const chaines = [];
      results.forEach((chaine) => {
        chaines.push({
          idchaine: chaine.idchaine,
          nom: chaine.nom,
          nombrehotel: chaine.nombrehotel
        })
      });
      resolve(chaines);
    });
  });
}

function getBureauxFromChaine(chaineid) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Bureau
      WHERE idchaine = ?
    `;
    db.query(sql, [chaineid], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function getHotelsFromChaine(idChaine) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM hotel WHERE idchaine = ${idChaine}`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}




//========Fonction pour ajouter-Modfier-Receercher-Supprimer :=========

// Fonctions  HOTEL : 


function deleteHotelById(id) {
  // Vérifier si l'hôtel existe
  const checkHotelQuery = `SELECT * FROM hotel WHERE idhotel = ${id}`;
  db.query(checkHotelQuery, (err, results) => {
    if (err) {
      console.error('Error checking hotel:', err);
      return;
    }
    // Si l'hôtel existe, le supprimer
    if (results.length > 0) {
      const deleteHotelQuery = `DELETE FROM hotel WHERE idhotel = ${id}`;
      db.query(deleteHotelQuery, (err) => {
        if (err) {
          console.error('Error deleting hotel:', err);
          return;
        }
        // console.log('> Hotel deleted from database');
      });
    }
    // Si l'hôtel n'existe pas, afficher un message d'erreur
    else {
      console.error('Error: hotel not found');
      return;
    }
  });
}

function addHotel(nom, classement, nombreChambres, rue, codePostal, ville, email, numeroTel, idchaine) {
  nombreChambres = 0;
  // Vérifier si la chaîne hôtelière existe déjà
  const checkChainehoteliere = `SELECT * FROM chainehoteliere WHERE idchaine = ${idchaine}`;
  db.query(checkChainehoteliere, (err, results) => {
    if (err) {
      console.error('Error checking chainehoteliere:', err);
      return;
    }
    // Si la chaîne hôtelière existe, ajouter l'hôtel et incrémenter le nombre d'hôtels
    if (results.length > 0) {
      const addHotelQuery = `INSERT INTO hotel (nom, classement, nombrechambres, rue, codePostal, ville, email, numeroTel, idchaine) 
                              VALUES ("${nom}", ${classement}, ${nombreChambres}, "${rue}", "${codePostal}", "${ville}", "${email}", "${numeroTel}", ${idchaine})`;
      db.query(addHotelQuery, (err) => {
        if (err) {
          console.error('Error adding hotel:', err);
          return;
        }
        //   console.log('> Hotel added to database');
        const incrementCountQuery = `UPDATE chainehoteliere SET nombrehotel = nombrehotel + 1 WHERE idchaine = ${idchaine}`;
        db.query(incrementCountQuery, (err) => {
          if (err) {
            console.error('Error incrementing count:', err);
            return;
          }
          // console.log('> Count incremented for chainehoteliere');
        });
      });
    }
    // Si la chaîne hôtelière n'existe pas, ne rien faire
    else {
      console.error('Error: chainehoteliere not found');
      return;
    }
  });
}






// Fonctions  Employee : 
function createEmployee(NAS, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) {
  const query = `INSERT INTO employe (NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) 
                 VALUES ("${NAS}", "${prenom}", "${nomFamille}", "${rue}", "${codePostal}", "${ville}", "${username}", "${password}", ${idhotel})`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error creating employee: ", err);
      return;
    }
    console.log(`Employee with NAS ${NAS} has been created.`);
  });
}

function createEmployeeAsync(NAS, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) {
  return new Promise((resolve, reject) => {
    createEmployee(NAS, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}


function createRandomEmployees(numEmployees, idhotel) {
  for (let i = 0; i < numEmployees; i++) {
    const NAS = faker.random.number({min: 100000000, max: 999999999}).toString();
    const prenom = faker.name.firstName();
    const nomFamille = faker.name.lastName();
    const rue = faker.address.streetAddress();
    const codePostal = faker.address.zipCode();
    const ville = faker.address.city();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    createEmployee(NAS, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel);
  }
}

function addRandomEmployees() {
  const numHotels = faker.random.number({min: 4, max: 7});
  const query = `SELECT idhotel FROM hotel ORDER BY RAND() LIMIT ${numHotels}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error selecting hotels: ", err);
      return;
    }
    for (let i = 0; i < results.length; i++) {
      const idhotel = results[i].idhotel;
      const numEmployees = faker.random.number({min: 2, max: 6});
      createRandomEmployees(numEmployees, idhotel);
    }
  });
}





function getEmployeeByUsernameAndPassword(username, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM employe WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Error finding employee:', err);
        reject(err);
        return;
      }
      if (results.length === 0) {
        console.log(`no user found with username='${username}' AND password='${password}`);
        resolve(null);
        return;
      }
      const employee = results[0];
      console.log(`Employee found: username: ${employee.username}, password: ${employee.password}`);
      resolve(employee);
    });
  });
}




function createRandomChainesHoteleres() {
  //const nombreChainesHoteleres = faker.datatype.number({ min: 5, max: 10 });
  const nombreChainesHoteleres = 5

  for (let i = 0; i < nombreChainesHoteleres; i++) {
    const nomChaineHoteliere = faker.company.name();
    const nombreHotels = faker.datatype.number({ min: 10, max: 20 });
    const rue = faker.address.street();
    const codePostal = faker.address.zipCode();
    const ville = faker.address.city();
    const email = faker.internet.email();
    const numeroTel = faker.phone.number();

    addChainehoteliereAndBureau(nomChaineHoteliere, nombreHotels, rue, codePostal, ville, email, numeroTel);
  }
}

//===========Fonction UI EMPLOTYEE =========






//========= Remplir la DB ===============
function populateBureaux() {
  const getAllChainesHoteleres = `SELECT * FROM chainehoteliere`;

  db.query(getAllChainesHoteleres, (err, result) => {
    if (err) {
      console.error('Error retrieving chaines hoteleres:', err);
      return;
    }

    //console.log('> Found chaines hoteleres:', result);

    // Ajouter entre 2 et 3 bureaux fictifs pour chaque chaîne hôtelière trouvée
    result.forEach((chaineHoteliere) => {
      const nombreBureaux = faker.datatype.number({ min: 2, max: 3 });
      console.log(`> Generating ${nombreBureaux} bureaux for chainehoteliere "${chaineHoteliere.nom}"`);

      for (let i = 0; i < nombreBureaux; i++) {
        const rue = faker.address.street();
        const codePostal = faker.address.zipCode();
        const ville = faker.address.city();
        const email = faker.internet.email();
        const numeroTel = faker.phone.number();
        const idchaine = chaineHoteliere.idchaine;

        addBureauToChainehoteliere(idchaine, rue, codePostal, ville, email, numeroTel);
      }
    });
  });
}

function populateHotels() {
  const getAllChainesHoteleres = `SELECT * FROM chainehoteliere`;

  db.query(getAllChainesHoteleres, (err, result) => {
    if (err) {
      console.error('Error retrieving chaines hoteleres:', err);
      return;
    }

    console.log(`> Found ${result.length} chaines hoteleres.`);

    result.forEach((chaineHoteliere) => {
      const nombreHotels = faker.datatype.number({ min: 15, max: 30 });
      console.log(`> Generating ${nombreHotels} hotels for chainehoteliere "${chaineHoteliere.nom}"`);

      for (let i = 0; i < nombreHotels; i++) {
        const nom = faker.company.name();
        const classement = faker.datatype.number({ min: 1, max: 5 });
        const nombreChambres = faker.datatype.number({ min: 10, max: 200 });
        const rue = faker.address.street();
        const codePostal = faker.address.zipCode();
        const ville = faker.address.city();
        const email = faker.internet.email();
        const numeroTel = faker.phone.number();
        const idchaine = chaineHoteliere.idchaine;

        addHotel(nom, classement, nombreChambres, rue, codePostal, ville, email, numeroTel, idchaine);
      }
    });
  });
}

function populateEmployees() {
  const hotelsQuery = 'SELECT * FROM hotel';

  db.query(hotelsQuery, (err, hotels) => {
    if (err) {
      console.error('Error getting hotels:', err);
      return;
    }

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      const numEmployees = Math.floor(Math.random() * (20 - 10 + 1) + 10); // entre 10 et 20 employés

      for (let j = 0; j < numEmployees; j++) {
        const employee = {
          NAS: faker.random.numeric(9),
          prenom: faker.name.firstName(),
          nomFamille: faker.name.lastName(),
          rue: faker.address.streetAddress(),
          codePostal: faker.address.zipCode(),
          ville: faker.address.city(),
          username: faker.internet.userName(),
          password: faker.internet.password(),
          idhotel: hotel.idhotel,
        };

        createEmployee(
          employee.NAS,
          employee.prenom,
          employee.nomFamille,
          employee.rue,
          employee.codePostal,
          employee.ville,
          employee.username,
          employee.password,
          employee.idhotel,
          (err) => {
            if (err) {
              console.error('Error creating employee:', err);
              return;
            }

            console.log(`Employee created at hotel ${employee.idhotel}: ${employee.username} - ${employee.password}`);
          }
        );
      }
    }
  });
}


function populateDb() {
  createRandomChainesHoteleres();
  populateBureaux();
  populateHotels();
  populateEmployees();
}

function checkRolesForEmployees() {
  const roles = [
    'Réceptionniste',
    'Responsable des réservations',
    'Personnel entretien et de maintenance',
    'Personnel de ménage',
    'Chef cuisinier et personnel de cuisine',
    'Serveur ou serveuse',
    'Barman ou barmaid',
    'Concierge',
    'Agent de sécurité',
    'Responsable des finances et de la comptabilité',
    'Responsable des ressources humaines',
    'Responsable des opérations',
    'Responsable des ventes et du marketing',
    'Responsable des événements',
    'Responsable des relations avec les clients'
  ];

  const query = `
    SELECT e.NASemploye, h.idhotel
    FROM employe e
    JOIN hotel h ON e.idhotel = h.idhotel
    WHERE NOT EXISTS (
      SELECT r.idrole
      FROM role r
      WHERE r.NASemploye = e.NASemploye
    )`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error checking roles for employees:', err);
      return;
    }

    // For each employee without a role
    result.forEach((row) => {
      const employeeNas = row.NASemploye;
      const hotelId = row.idhotel;

      // Select a random role from the roles array
      const randomRole = roles[Math.floor(Math.random() * roles.length)];

      // Create the role for the employee
      const createRoleQuery = `
        INSERT INTO role (nom, salaireDebut, idhotel, NASemploye)
        VALUES ('${randomRole}', ${Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000}.00, ${hotelId}, '${employeeNas}')`;

      db.query(createRoleQuery, (err) => {
        if (err) {
          console.error('Error creating role:', err);
          return;
        }

        console.log(`Created role ${randomRole} for employee ${employeeNas}`);
      });
    });
  });
}

function assignHotelManagers() {
  const selectHotelsQuery = 'SELECT * FROM hotel';
  const selectEmployeesQuery = 'SELECT * FROM employe WHERE idhotel = ?';
  const insertRoleQuery = 'INSERT INTO role (nom, salaireDebut, idhotel, NASemploye) VALUES (?, ?, ?, ?)';

  db.query(selectHotelsQuery, (err, hotels) => {
    if (err) {
      console.error('Error selecting hotels:', err);
      return;
    }

    hotels.forEach((hotel) => {
      const { idhotel } = hotel;

      // Check if hotel has a manager
      const selectManagerQuery = 'SELECT * FROM role WHERE idhotel = ? AND nom = "Manager"';
      db.query(selectManagerQuery, [idhotel], (err, manager) => {
        if (err) {
          console.error(`Error selecting manager for hotel ${idhotel}:`, err);
          return;
        }

        // If hotel doesn't have a manager, assign one to a random employee
        if (manager.length === 0) {
          db.query(selectEmployeesQuery, [idhotel], (err, employees) => {
            if (err) {
              console.error(`Error selecting employees for hotel ${idhotel}:`, err);
              return;
            }

            const randomIndex = Math.floor(Math.random() * employees.length);
            //console.log(employees)

            const employee = employees[randomIndex];

            // Insert manager role for employee
            const { NASemploye } = employee;
            const managerRole = ['Manager', 50000, idhotel, NASemploye];
            db.query(insertRoleQuery, managerRole, (err) => {
              if (err) {
                console.error(`Error inserting manager role for employee ${NASemploye}:`, err);
                return;
              }
              console.log(`Manager role assigned to employee ${NASemploye} for hotel ${idhotel}`);
            });
          });
        }
      });
    });
  });
}


function addRoomsAndCommodities() {
  const hotelsQuery = 'SELECT idhotel FROM hotel';
  db.query(hotelsQuery, (err, results) => {
    if (err) {
      console.error('Error selecting hotels:', err);
      return;
    }

    console.log('> Selected hotels for adding rooms and commodities');

    results.forEach((hotel) => {
      const roomCount = faker.datatype.number({ min: 80, max: 140 });
      const roomInsertQuery = 'INSERT INTO chambre (prix, capaciteChambre, disponible, vue, etendue, problemechambre, idHotel) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const commodityInsertQuery = 'INSERT INTO commodite (nom, idchambre) VALUES (?, ?)';

      console.log(`> Adding ${roomCount} rooms for hotel ${hotel.idhotel}`);

      for (let i = 0; i < roomCount; i++) {
        const roomData = [
          faker.datatype.number({ min: 50, max: 300 }), // prix
          faker.datatype.number({ min: 1, max: 6 }), // capaciteChambre
          faker.datatype.boolean(), // disponible
          faker.lorem.words(2), // vue
          faker.lorem.words(2), // etendue
          faker.datatype.boolean(), // problemechambre
          hotel.idhotel // idHotel
        ];

        db.query(roomInsertQuery, roomData, (err, results) => {
          if (err) {
            console.error('Error inserting room:', err);
            return;
          }

          const roomId = results.insertId;

          // Ajouter des commodités pour chaque chambre
          const commodityCount = faker.datatype.number({ min: 0, max: 5 });

          for (let j = 0; j < commodityCount; j++) {
            const commodityData = [
              faker.lorem.words(2), // nom
              roomId // idchambre
            ];

            db.query(commodityInsertQuery, commodityData, (err) => {
              if (err) {
                console.error('Error inserting commodity:', err);
                return;
              }
            });
          }
        });
      }
    });
  });
}




const generateClients = () => {
  let clients = [];
  const numClients = Math.floor(Math.random() * (5000 - 3000) + 3000); // générer un nombre aléatoire entre 3000 et 5000
  for (let i = 0; i < numClients; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const streetAddress = faker.address.streetAddress();
    const zipCode = faker.address.zipCode();
    const city = faker.address.city();
    const registrationDate = faker.date.between('2010-01-01', '2022-03-19').toISOString().slice(0, 10); // générer une date aléatoire entre 2010 et aujourd'hui
    const username = faker.internet.userName();
    const password = faker.internet.password();

    const client = [faker.random.alphaNumeric(9).toUpperCase(), firstName, lastName, streetAddress, zipCode, city, registrationDate, username, password];
    clients.push(client);
  }
  return clients;
}

const insertClients = () => {
  const clients = generateClients();
  const insertQuery = "INSERT INTO client (NASclient, prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password) VALUES ?";
  db.query(insertQuery, [clients], (error, results) => {
    if (error) {
      throw error;
    }
    console.log(`${results.affectedRows} clients ont été insérés dans la base de données.`);
  });
}






function createRandomRentals() {
  // Query all clients from the client table
  db.query('SELECT * FROM client', (error, clients) => {
    if (error) throw error;

    // Loop through each client
    clients.forEach((client) => {
      // Select a random hotel for the client
      db.query('SELECT * FROM hotel ORDER BY RAND() LIMIT 1', (error, hotels) => {
        if (error) throw error;

        const hotel = hotels[0];

        // Select a random employee that works at the hotel
        db.query('SELECT * FROM employe WHERE idhotel = ? ORDER BY RAND() LIMIT 1', [hotel.idhotel], (error, employees) => {
          if (error) throw error;

          const employee = employees[0];

          // Generate between 1 and 3 rental transactions
          const numRentals = Math.floor(Math.random() * 3) + 1;

          for (let i = 0; i < numRentals; i++) {
            // Generate random dates between 2020 and 2024 using Faker
            const checkInDate = faker.date.between('2020-01-01', '2024-12-31');
            const checkOutDate = faker.date.between(checkInDate, '2024-12-31');

            // Generate a random payment method using Faker
            const paymentMethod = faker.finance.transactionType();

            // Select a random room at the hotel for the rental
            db.query('SELECT * FROM chambre WHERE idhotel = ? ORDER BY RAND() LIMIT 1', [hotel.idhotel], (error, chambres) => {
              if (error) throw error;

              const chambre = chambres[0];

              // Insert the rental into the loue table
              const rental = {
                idChambre: chambre.idChambre,
                NASclient: client.NASclient,
                NASemploye: employee.NASemploye,
                checkIndDate: checkInDate,
                checkOutDate: checkOutDate,
                paiement: paymentMethod,
                archive: false
              };

              db.query('INSERT INTO loue SET ?', rental, (error, results) => {
                if (error) throw error;
              });
            });
          }
        });
      });
    });
  });
}





//=========== MAIN ================
initDB();
initTable();
//populateDb()
//createRandomChainesHoteleres();
//populateBureaux();
//populateHotels();
//populateEmployees();
//assignHotelManagers();
//checkRolesForEmployees();
//addRoomsAndCommodities();
//insertClients();
//createReservations();
//createRandomRentals();

// ============ API CONFIG ===================

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen('3000', () => {
  console.log('Server started on port 3000');
});


// ============ API REQUESTS ===================

app.get('/', (req, res) => {
  db.query('SELECT DATABASE() as current_database', (err, results) => {
    if (err) {
      console.error('Error selecting database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const currentDb = results[0].current_database;
    if (currentDb === 'ehotel') {
      res.send('> Databasebase ehotel created and selected');
    } else {
      res.send('> Databasebase ehotel not created or selected');
    }
  });
});




app.get('/tables', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error getting tables:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const tables = results.map(result => result[`Tables_in_${db.config.database}`]);
    const columnsQueries = tables.map(table => `SHOW COLUMNS FROM ${table}`);
    const columnsPromises = columnsQueries.map(query => new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error(`Error getting columns for ${query}:`, err);
          reject(err);
        }
        const columns = results.map(result => result.Field);
        resolve(columns);
      });
    }));
    Promise.all(columnsPromises)
      .then(columnsArray => {
        const tablesColumns = tables.reduce((obj, table, i) => ({ ...obj, [table]: columnsArray[i] }), {});
        res.send(tablesColumns);
      })
      .catch(err => {
        console.error('Error getting columns:', err);
        res.status(500).send('Internal Server Error');
      });
  });
});



app.get('/chaines-et-bureaux', (req, res) => {
  getChainesAndBureaux()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des chaines et bureaux :', err);
      res.status(500).send('Erreur lors de la récupération des chaines et bureaux.');
    });
});



app.post('/add-chainehoteliere-bureau', (req, res) => {
  console.log(req.body)
  const { nomChaine, nombrehotel, rue, codePostal, ville, email, numeroTel } = req.body;

  addChainehoteliereAndBureau(nomChaine, nombrehotel, rue, codePostal, ville, email, numeroTel, (err, result) => {
    if (err) {
      console.error('Error adding record to chainehoteliere and Bureau:', err);
      res.status(500).send('Error adding record to chainehoteliere and Bureau');
      return;
    }
    res.status(200).send('Record added to chainehoteliere and Bureau');
  });
});




// Route pour la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM employe 
                 JOIN hotel ON employe.idhotel = hotel.idhotel
                 JOIN chainehoteliere ON hotel.idchaine = chainehoteliere.idchaine
                 JOIN bureau ON chainehoteliere.idchaine = bureau.idchaine
                 WHERE employe.username = '${username}' AND employe.password = '${password}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing login query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result[0];
    const userInfo = {
      employe: {
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        rue: user.rue,
        codePostal: user.codePostal,
        ville: user.ville,
        NASemploye: user.NASemploye,
        idhotel: user.idhotel
      },
      hotel: {
        nom: user.nom,
        classement: user.classement,
        nombrechambres: user.nombrechambres,
        rue: user.rue,
        codePostal: user.codePostal,
        ville: user.ville,
        email: user.email,
        numeroTel: user.numeroTel,
        idchaine: user.idchaine
      },
      chainehoteliere: {
        nom: user.nom,
        nombrehotel: user.nombrehotel
      },
      bureaux: result.map(row => ({
        idBureau: row.idBureau,
        rue: row.rue,
        codePostal: row.codePostal,
        ville: row.ville,
        email: row.email,
        numeroTel: row.numeroTel
      }))
    };

    res.json(userInfo);
  });
});

app.post('/profile', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM employe 
                 JOIN hotel ON employe.idhotel = hotel.idhotel
                 JOIN chainehoteliere ON hotel.idchaine = chainehoteliere.idchaine
                 JOIN bureau ON chainehoteliere.idchaine = bureau.idchaine
                 WHERE employe.username = '${username}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing login query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0 ) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result[0];
    const userInfo = {
      employe: {
        username:user.username,
        password:user.password,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        rue: user.rue,
        codePostal: user.codePostal,
        ville: user.ville,
        NASemploye: user.NASemploye,
        idhotel: user.idhotel
        
      },
      hotel: {
        nom: user.nom,
        classement: user.classement,
        nombrechambres: user.nombrechambres,
        rue: user.rue,
        codePostal: user.codePostal,
        ville: user.ville,
        email: user.email,
        numeroTel: user.numeroTel,
        idchaine: user.idchaine
      },
      chainehoteliere: {
        nom: user.nom,
        nombrehotel: user.nombrehotel
      },
      bureaux: result.map(row => ({
        idBureau: row.idBureau,
        rue: row.rue,
        codePostal: row.codePostal,
        ville: row.ville,
        email: row.email,
        numeroTel: row.numeroTel
      }))
    };

    res.json(userInfo);
  });
});


app.get('/chaines-hotellieres', (req, res) => {
  getAllChainesHotellieres()
    .then((chaines) => {
      res.json(chaines);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des chaines hotellieres :', err);
      res.status(500).send('Erreur lors de la récupération des chaines hotellieres.');
    });
});


app.post('/bureau', (req, res) => {
  console.log(req.body)
  const data = req.body


  const { nomBureau, rueBureau, codePostalBureau, villeBureau, emailBureau, numeroTelBureau, idHotel } = req.body;
  console.log([data.chainehoteliere, data.rue, data.codePostal, data.ville, data.email, data.numeroTel])
  res.status(200).send('Bureau added to hotel');
  addBureauToChainehoteliere(data.chainehoteliere, data.rue, data.codePostal, data.ville, data.email, data.numeroTel)
  /*
  addBureauToChainehoteliere(nomBureau, rueBureau, codePostalBureau, villeBureau, emailBureau, numeroTelBureau, idHotel, (err, result) => {
    if (err) {
      console.error('Error adding bureau to hotel:', err);
      res.status(500).send('Error adding bureau to hotel');
      return;
    }
    res.status(200).send('Bureau added to hotel');
  });*/
});


const users = {};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  // Check if user exists and password is correct in the database
  db.query('SELECT * FROM employe WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).send('Username or password incorrect');
    }
    const token = generateToken(username);
    // Add user to dictionary with token as key and username as value
    users[token] = username;
    res.json({ token });
  });
});

function generateToken(username) {
  // Generate a random token (in this case a UUIDv4) to use as the key in the users dictionary
  const uuidv4 = require('uuid').v4;
  return uuidv4();
}



function getHotelAndRooms(token) {
  return new Promise((resolve, reject) => {
    const username = users[token];
    if (!username) {
      reject(new Error('Invalid token'));
      return;
    }

    const hotelQuery = `SELECT hotel.idhotel, hotel.nom AS hotel_nom, hotel.rue AS hotel_rue, hotel.codePostal AS hotel_codePostal, hotel.ville AS hotel_ville, 
               (SELECT COUNT(*) FROM chambre WHERE chambre.idHotel = hotel.idhotel) AS nombrechambres
               FROM hotel 
               JOIN employe ON employe.idhotel = hotel.idhotel 
               WHERE employe.username = '${username}'`;

    const roomsQuery = `SELECT chambre.idChambre, chambre.prix, chambre.capaciteChambre, chambre.disponible, chambre.vue, chambre.etendue, chambre.problemechambre
                        FROM chambre 
                        JOIN hotel ON hotel.idhotel = chambre.idHotel 
                        JOIN employe ON employe.idhotel = hotel.idhotel
                        WHERE employe.username = '${username}'`;

    db.query(hotelQuery, (err, hotelResult) => {
      if (err || hotelResult.length === 0) {
        console.error('Error executing get hotel query:', err);
        reject(new Error('Internal server error'));
        return;
      }

      const hotel = {
        idhotel: hotelResult[0].idhotel,
        nom: hotelResult[0].hotel_nom,
        rue: hotelResult[0].hotel_rue,
        codePostal: hotelResult[0].hotel_codePostal,
        ville: hotelResult[0].hotel_ville,
        nombrechambres: hotelResult[0].nombrechambres,
      };

      db.query(roomsQuery, (err, roomsResult) => {
        if (err) {
          console.error('Error executing get rooms query:', err);
          reject(new Error('Internal server error'));
          return;
        }

        const chambres = roomsResult.map(row => ({
          idChambre: row.idChambre,
          prix: row.prix,
          capaciteChambre: row.capaciteChambre,
          disponible: row.disponible,
          vue: row.vue,
          etendue: row.etendue,
          problemechambre: row.problemechambre
        }));

        const hotelAndRoomsInfo = {
          hotel,
          chambres
        };
        
        resolve(hotelAndRoomsInfo);
      });
    });
  });
}



function getMainProfileInfos(token) {
  return new Promise((resolve, reject) => {
    const username = users[token];
    if (!username) {
      reject(new Error('Invalid token'));
      return;
    }

    const query = `SELECT employe.NASemploye, employe.prenom AS employe_prenom, employe.nomFamille AS employe_nomFamille, employe.rue AS employe_rue, employe.codePostal AS employe_codePostal, employe.ville AS employe_ville, employe.username AS employe_username, employe.password AS employe_password, 
    hotel.idhotel, hotel.nom AS hotel_nom, hotel.classement, hotel.nombrechambres, hotel.rue AS hotel_rue, hotel.codePostal AS hotel_codePostal, hotel.ville AS hotel_ville, hotel.email AS hotel_email, hotel.numeroTel AS hotel_numeroTel, 
    chainehoteliere.idchaine, chainehoteliere.nom AS chainehoteliere_nom, chainehoteliere.nombrehotel AS chainehoteliere_nombrehotel, 
    bureau.idBureau, bureau.rue AS bureau_rue, bureau.codePostal AS bureau_codePostal, bureau.ville AS bureau_ville, bureau.email AS bureau_email, bureau.numeroTel AS bureau_numeroTel 
  FROM employe
  JOIN hotel ON employe.idhotel = hotel.idhotel
  JOIN chainehoteliere ON hotel.idchaine = chainehoteliere.idchaine
  JOIN bureau ON chainehoteliere.idchaine = bureau.idchaine
  WHERE employe.username = '${username}'`;

    db.query(query, (err, result) => {
      if (err || result.length === 0) {
        console.error('Error executing main profile query:', err);
        reject(new Error('Internal server error'));
        return;
      }

      const user = result[0];

      const userInfo = {
        employe: {
          username: user.employe_username,
          password: user.employe_password,
          prenom: user.employe_prenom,
          nomFamille: user.employe_nomFamille,
          rue: user.employe_rue,
          codePostal: user.employe_codePostal,
          ville: user.employe_ville,
          NASemploye: user.NASemploye,
          idhotel: user.idhotel
        },
        hotel: {
          nom: user.hotel_nom,
          classement: user.classement,
          nombrechambres: user.nombrechambres,
          rue: user.hotel_rue,
          codePostal: user.hotel_codePostal,
          ville: user.hotel_ville,
          email: user.hotel_email,
          numeroTel: user.hotel_numeroTel,
          idchaine: user.idchaine
        },
        chainehoteliere: {
          nom: user.chainehoteliere_nom,
          nombrehotel: user.chainehoteliere_nombrehotel
        },
        bureaux: result.map(row => ({
          idBureau: row.idBureau,
          rue: row.bureau_rue,
          codePostal: row.bureau_codePostal,
          ville: row.bureau_ville,
          email: row.bureau_email,
          numeroTel: row.bureau_numeroTel
        }))
      };
      
      resolve(userInfo);
    });
  });
}


// Endpoint pour la requête username
app.get('/api/mainProfileInfos', (req, res) => {
  const token = req.headers.authorization;
  //console.log(token)
  getHotelAndRooms(token)
  .then((userInfo) => {
   // console.log(userInfo);
  })
  .catch((error) => {
    console.error(error);
  });
  const username = users[token];
  if (!username) {
    return res.status(401).send('Invalid token');
  }

  const query = `SELECT employe.NASemploye, employe.prenom AS employe_prenom, employe.nomFamille AS employe_nomFamille, employe.rue AS employe_rue, employe.codePostal AS employe_codePostal, employe.ville AS employe_ville, employe.username AS employe_username, employe.password AS employe_password, 
  hotel.idhotel, hotel.nom AS hotel_nom, hotel.classement, hotel.nombrechambres, hotel.rue AS hotel_rue, hotel.codePostal AS hotel_codePostal, hotel.ville AS hotel_ville, hotel.email AS hotel_email, hotel.numeroTel AS hotel_numeroTel, 
  chainehoteliere.idchaine, chainehoteliere.nom AS chainehoteliere_nom, chainehoteliere.nombrehotel AS chainehoteliere_nombrehotel, 
  bureau.idBureau, bureau.rue AS bureau_rue, bureau.codePostal AS bureau_codePostal, bureau.ville AS bureau_ville, bureau.email AS bureau_email, bureau.numeroTel AS bureau_numeroTel 
FROM employe
JOIN hotel ON employe.idhotel = hotel.idhotel
JOIN chainehoteliere ON hotel.idchaine = chainehoteliere.idchaine
JOIN bureau ON chainehoteliere.idchaine = bureau.idchaine
WHERE employe.username = '${username}'`;

  db.query(query, (err, result) => {
    if (err || result.length === 0) {
      console.error('Error executing main profile query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const user = result[0];
    //console.log(result)
    const userInfo = {
      employe: {
        username: user.employe_username,
        password: user.employe_password,
        prenom: user.employe_prenom,
        nomFamille: user.employe_nomFamille,
        rue: user.employe_rue,
        codePostal: user.employe_codePostal,
        ville: user.employe_ville,
        NASemploye: user.NASemploye,
        idhotel: user.idhotel
      },
      hotel: {
        nom: user.hotel_nom,
        classement: user.classement,
        nombrechambres: user.nombrechambres,
        rue: user.hotel_rue,
        codePostal: user.hotel_codePostal,
        ville: user.hotel_ville,
        email: user.hotel_email,
        numeroTel: user.hotel_numeroTel,
        idchaine: user.idchaine
      },
      chainehoteliere: {
        nom: user.chainehoteliere_nom,
        nombrehotel: user.chainehoteliere_nombrehotel
      },
      bureaux: result.map(row => ({
        idBureau: row.idBureau,
        rue: row.bureau_rue,
        codePostal: row.bureau_codePostal,
        ville: row.bureau_ville,
        email: row.bureau_email,
        numeroTel: row.bureau_numeroTel
      }))
    };
    
    //console.log(userInfo)
    res.json(userInfo);
  });
});


app.get('/api/hotelInfos', (req, res) => {
  const token = req.headers.authorization;
  console.log(req)
  getHotelAndRooms(token)
    .then(hotelAndRoomsInfo => {
      res.json(hotelAndRoomsInfo);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//================================= TEST : A ENLEVER MB3D ============

app.get('/randomEmployee', (req, res) => {
  db.query('SELECT username, password FROM employe ORDER BY RAND() LIMIT 1', (error, results, fields) => {
    if (error) throw error;
    res.send(JSON.stringify(results[0]));
  });
});
