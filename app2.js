const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

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
        idrole INTEGER PRIMARY KEY,
        nom VARCHAR(255),
        salaireDebut DECIMAL(10, 2),
        idhotel INTEGER,
        NASemploye VARCHAR(255),
        FOREIGN KEY (idhotel) REFERENCES hotel(idhotel),
        FOREIGN KEY (NASemploye) REFERENCES employe(NASemploye)
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
  const nombreChainesHoteleres = faker.datatype.number({ min: 5, max: 10 });

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
      const nombreHotels = faker.datatype.number({ min: 40, max: 70 });
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
  const hotelsQuery = 'SELECT * FROM hotel ORDER BY RAND() LIMIT 10';

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
          NAS: faker.random.alphaNumeric(9),
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




//=========== MAIN ================
initDB();
initTable();
populateDb()

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









//================================= TEST : A ENLEVER MB3D ============

app.get('/randomEmployee', (req, res) => {
  db.query('SELECT username, password FROM employe ORDER BY RAND() LIMIT 1', (error, results, fields) => {
    if (error) throw error;
    res.send(JSON.stringify(results[0]));
  });
});
