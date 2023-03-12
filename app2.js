const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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
    database: 'eHotel',

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
      numeroTel INTEGER,
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
        numeroTel INTEGER,
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

}


//========Fonction pour ajouter-Modfier-Receercher-Supprimer :=========

// Fonctions  ChaineHoteliere : 
function addChainehoteliereAndBureau(nom, nombrehotel, rue, codePostal, ville, email, numeroTel) {
    // First insert the new record into the chainehoteliere table
    const insertChainehoteliereQuery = 'INSERT INTO chainehoteliere (nom, nombrehotel) VALUES (?, ?)';
    db.query(insertChainehoteliereQuery, [nom, nombrehotel], (err, results) => {
      if (err) {
        console.error('Error adding record to chainehoteliere:', err);
        return;
      }
      console.log(`> New record added to chainehoteliere with ID ${results.insertId}`);
      // Once the chainehoteliere record is inserted, insert the new record into the Bureau table
      const insertBureauQuery = 'INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertBureauQuery, [rue, codePostal, ville, email, numeroTel, results.insertId], (err, results) => {
        if (err) {
          console.error('Error adding record to Bureau:', err);
          return;
        }
        console.log(`> New record added to Bureau with ID ${results.insertId}`);
      });
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



initDB();
initTable();


// ============ API ===================

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});

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
  
  