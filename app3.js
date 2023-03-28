const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306
});

// Function to initialize the database and tables
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
      console.log('> Database ehotel created or already exists');
      db.changeUser({ database: 'ehotel' }, (err) => {
        if (err) {
          console.error('Error selecting database:', err);
          return;
        }
        console.log('> Database ehotel selected');

        initTable(); // Call initTable() to create tables after selecting the database
      });
    });
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
  

initDB();

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


//   ####### CRUD ChaineHoteliere Bureau 

// POST /chaines-hotels

app.post('/chaines-hotels', (req, res) => {
    const { nom, nombrehotel, rue, codePostal, ville, email, numeroTel } = req.body;
  
    db.beginTransaction(error => {
      if (error) {
        console.error('Error starting transaction:', error);
        res.status(500).send('Error adding chainehoteliere and bureau');
        return;
      }
  
      db.query('INSERT INTO chainehoteliere (nom, nombrehotel) VALUES (?, ?)', [nom, nombrehotel], (error, results) => {
        if (error) {
          console.error('Error adding chainehoteliere:', error);
          db.rollback(() => {
            res.status(500).send('Error adding chainehoteliere and bureau');
          });
          return;
        }
  
        const idChaine = results.insertId;
  
        db.query('INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)', [rue, codePostal, ville, email, numeroTel, idChaine], (error, results) => {
          if (error) {
            console.error('Error adding Bureau:', error);
            db.rollback(() => {
              res.status(500).send('Error adding chainehoteliere and bureau');
            });
            return;
          }
  
          db.commit(error => {
            if (error) {
              console.error('Error committing transaction:', error);
              db.rollback(() => {
                res.status(500).send('Error adding chainehoteliere and bureau');
              });
              return;
            }
  
            res.status(201).send('Chainehoteliere and bureau added successfully');
          });
        });
      });
    });
  });
  
  
// POST /chaines-hotels/{idChaine}/bureaux

app.post('/chaines-hotels/:idChaine/bureaux', (req, res) => {
    const { rue, codePostal, ville, email, numeroTel } = req.body;
    const { idChaine } = req.params;
  
    db.query('INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)', [rue, codePostal, ville, email, numeroTel, idChaine], (error, results) => {
      if (error) {
        console.error('Error adding Bureau:', error);
        res.status(500).send('Error adding Bureau');
        return;
      }
  
      res.status(201).send('Bureau added successfully');
    });
  });
  

// GET /chaines-hotels/:querry


app.get('/chaines-hotels/:query?', (req, res) => {
    const { query } = req.params;
    const { nom } = req.query;
    let queryString;
  
    if (query) {
      queryString = 'SELECT * FROM chainehoteliere WHERE idchaine = ? OR nom = ?';
    } else if (nom) {
      queryString = 'SELECT * FROM chainehoteliere WHERE nom = ?';
    } else {
      queryString = 'SELECT * FROM chainehoteliere';
    }
  
    db.query(queryString, [query || nom], (error, results) => {
      if (error) {
        console.error('Error fetching chainehoteliere:', error);
        res.status(500).send('Error fetching chainehoteliere');
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('Chainehoteliere not found');
        return;
      }
  
      const chaineshotelsPromises = results.map((chainehoteliere) => {
        return new Promise((resolve, reject) => {
          const chainehotelWithHotels = { ...chainehoteliere };
  
          db.query('SELECT * FROM Bureau WHERE idchaine = ?', [chainehotelWithHotels.idchaine], (error, results) => {
            if (error) {
              console.error('Error fetching bureaux:', error);
              reject(error);
            } else {
              chainehotelWithHotels.bureaux = results;
  
              db.query('SELECT * FROM hotel WHERE idchaine = ?', [chainehotelWithHotels.idchaine], (error, results) => {
                if (error) {
                  console.error('Error fetching hotels:', error);
                  reject(error);
                } else {
                  chainehotelWithHotels.hotels = results;
                  resolve(chainehotelWithHotels);
                }
              });
            }
          });
        });
      });
  
      Promise.all(chaineshotelsPromises)
        .then((chaineshotels) => {
          res.send(chaineshotels);
        })
        .catch((error) => {
          console.error('Error fetching chainehoteliere, bureaux, and hotels:', error);
          res.status(500).send('Error fetching chainehoteliere, bureaux, and hotels');
        });
    });
  });
  

// DELETE /chaines-hotels/{idChaine}

app.delete('/chaines-hotels/:idChaine', (req, res) => {
    const { idChaine } = req.params;
  
    db.query('DELETE FROM chainehoteliere WHERE idchaine = ?', [idChaine], (error, results) => {
        if (error) {
        console.error('Error deleting chainehoteliere:', error);
        res.status(500).send('Error deleting chainehoteliere');
        return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Chainehoteliere not found');
            return;
          }
          
          res.send('Chainehoteliere deleted successfully');});
        });


// DELETE /chaines-hotels/{idChaine}/bureaux/{idBureau}

app.delete('/chaines-hotels/:idChaine/bureaux/:idBureau', (req, res) => {
    const { idChaine, idBureau } = req.params;
    
    db.query('DELETE FROM Bureau WHERE idBureau = ? AND idchaine = ?', [idBureau, idChaine], (error, results) => {
    if (error) {
    console.error('Error deleting Bureau:', error);
    res.status(500).send('Error deleting Bureau');
    return;
    }
    if (results.affectedRows === 0) {
        res.status(404).send('Bureau not found');
        return;
      }
      
      res.send('Bureau deleted successfully');
    });
});

// PUT /chaines-hotels/{idChaine}

app.put('/chaines-hotels/:idChaine', (req, res) => {
const { nom, nombrehotel } = req.body;
const { idChaine } = req.params;

db.query('UPDATE chainehoteliere SET nom = ?, nombrehotel = ? WHERE idchaine = ?', [nom, nombrehotel, idChaine], (error, results) => {
if (error) {
console.error('Error updating chainehoteliere:', error);
res.status(500).send('Error updating chainehoteliere');
return;
}if (results.affectedRows === 0) {
    res.status(404).send('Chainehoteliere not found');
    return;
  }
  
  res.send('Chainehoteliere updated successfully');});
});

// PUT /chaines-hotels/{idChaine}/bureaux/{idBureau}

app.put('/chaines-hotels/:idChaine/bureaux/:idBureau', (req, res) => {
const { rue, codePostal, ville, email, numeroTel } = req.body;
const { idChaine, idBureau } = req.params;

db.query('UPDATE Bureau SET rue = ?, codePostal = ?, ville = ?, email = ?, numeroTel = ? WHERE idBureau = ? AND idchaine = ?', [rue, codePostal, ville, email, numeroTel, idBureau, idChaine], (error, results) => {
if (error) {
console.error('Error updating Bureau:', error);
res.status(500).send('Error updating Bureau');
return;
}if (results.affectedRows === 0) {
    res.status(404).send('Bureau not found');
    return;
  }
  
  res.send('Bureau updated successfully');});
});
  
  












app.get('/randomEmployee', (req, res) => {
    db.query('SELECT username, password FROM employe ORDER BY RAND() LIMIT 1', (error, results, fields) => {
      if (error) throw error;
      res.send(JSON.stringify(results[0]));
    });
  });
      
          
  