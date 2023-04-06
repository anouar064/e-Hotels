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


const users = {};


function generateToken(username) {
  // Generate a random token (in this case a UUIDv4) to use as the key in the users dictionary
  const uuidv4 = require('uuid').v4;
  return uuidv4();
}

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

        initTable(); 
        initTrigger();
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
          archive BOOLEAN DEFAULT FALSE,
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
          archive BOOLEAN DEFAULT FALSE,
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


    db.query(createClientTable, (err) => {
      if (err) {
        console.error('Error creating client table:', err);
        return;
      }
      console.log('> Table client created or already exists');
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
    
  

  
  
  }
  
function initTrigger() {

    // Triggers
    const createTrigger1 = `
      CREATE TRIGGER IF NOT EXISTS  after_insert_hotel
      AFTER INSERT ON hotel
      FOR EACH ROW
      BEGIN
        UPDATE chainehoteliere
        SET nombrehotel = nombrehotel + 1
        WHERE idchaine = NEW.idchaine;
      END;
    `;
  
    const createTrigger2 = `
      CREATE TRIGGER IF NOT EXISTS  after_delete_hotel
      AFTER DELETE ON hotel
      FOR EACH ROW
      BEGIN
        UPDATE chainehoteliere
        SET nombrehotel = nombrehotel - 1
        WHERE idchaine = OLD.idchaine;
      END;
    `;
    const createTrigger3 = `
    CREATE TRIGGER IF NOT EXISTS before_insert_reserve
    BEFORE INSERT ON reserve
    FOR EACH ROW
    BEGIN
      IF EXISTS (
        SELECT *
        FROM reserve
        WHERE idChambre = NEW.idChambre
          AND checkInDate < NEW.checkOutDate
          AND checkOutDate > NEW.checkInDate
      )
      THEN
        SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Cannot insert reservation. Conflicting room reservation exists.';
      END IF;
    END;
  `;
  
  const createTrigger4 = `
  CREATE TRIGGER IF NOT EXISTS before_insert_location
  BEFORE INSERT ON loue
  FOR EACH ROW
  BEGIN
    IF EXISTS (
      SELECT *
      FROM loue
      WHERE idChambre = NEW.idChambre
        AND checkIndDate < NEW.checkOutDate
        AND checkOutDate > NEW.checkIndDate
    )
    THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert location. Conflicting room reservation exists.';
    END IF;
  END;
`;


const createTrigger5 = `
CREATE TRIGGER IF NOT EXISTS maj_nb_chambres
AFTER INSERT ON chambre
FOR EACH ROW
UPDATE hotel
SET nombrechambres = nombrechambres + 1
WHERE idhotel = NEW.idhotel;
`;

const createTrigger6 = `
CREATE TRIGGER IF NOT EXISTS maj_nb_chambres_supprime
AFTER DELETE ON chambre
FOR EACH ROW
UPDATE hotel
SET nombrechambres = nombrechambres - 1
WHERE idhotel = OLD.idhotel;
`;
const createTrigger7 = `
CREATE TRIGGER IF NOT EXISTS archive_location_trigger
BEFORE INSERT ON loue
FOR EACH ROW
BEGIN
    IF YEAR(NEW.checkIndDate) < YEAR(NOW()) OR YEAR(NEW.checkOutDate) < YEAR(NOW()) THEN
        SET NEW.archive = TRUE;
    ELSE
        SET NEW.archive = FALSE;
    END IF;
END;
`;
const createTrigger8 = `
CREATE TRIGGER IF NOT EXISTS delete_employe_loue
AFTER DELETE ON employe
FOR EACH ROW
BEGIN
  UPDATE loue SET NASemploye = NULL WHERE NASemploye = OLD.NASemploye;
END;
`;
const createTrigger9 = `
CREATE TRIGGER IF NOT EXISTS delete_client_reserve
AFTER DELETE ON client
FOR EACH ROW
BEGIN
  UPDATE reserve SET NASclient = NULL WHERE NASclient = OLD.NASclient;
END;
`;





// Query triggers


  
  
    // Query triggers
    db.query(createTrigger1, (err) => {
      if (err) {
        console.error('Error creating trigger 1:', err);
        return;
      }
      console.log('> Trigger (1) Count hotel created');
    });
  
    db.query(createTrigger2, (err) => {
      if (err) {
        console.error('Error creating trigger 2:', err);
        return;
      }
      console.log('> Trigger (2) Count room  created');
    });

    db.query(createTrigger3, (err) => {
      if (err) {
        console.error('Error creating trigger 3:', err);
        return;
      }
      console.log('> Trigger (3) Check room availability created');
    });

    db.query(createTrigger4, (err) => {
      if (err) {
        console.error('Error creating trigger 4:', err);
        return;
      }
      console.log('> Trigger (4) Check room availability for location created');
    });
    db.query(createTrigger5, (err) => {
      if (err) {
        console.error('Error creating trigger 5:', err);
        return;
      }
      console.log('> Trigger (5) Count room created');
      });
      db.query(createTrigger6, (err) => {
        if (err) {
          console.error('Error creating trigger 6:', err);
          return;
        }
        console.log('> Trigger (6) Count room deleted');
        });
      db.query(createTrigger7, (err) => {
          if (err) {
            console.error('Error creating trigger 7:', err);
            return;
          }
          console.log('> Trigger (7) Archive location created');
        });
      
      db.query(createTrigger8, (err) => {
      if (err) {
        console.error('Error creating trigger 2:', err);
        return;
      }
      console.log('> Trigger (8) Count room deleted');
      });
      db.query(createTrigger9, (err) => {
        if (err) {
          console.error('Error creating trigger 7:', err);
          return;
        }
        console.log('> Trigger (9) Archive location created');
      });
      }
      
      // Call the function to create triggers
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


// ####### CRUD ChaineHoteliere Bureau 

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
    
          const idchaine = results.insertId;
    
          db.query('INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)', [rue, codePostal, ville, email, numeroTel, idchaine], (error, results) => {
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
  // POST /chaines-hotels/{idchaine}/bureaux
  app.post('/chaines-hotels/:idchaine/bureaux', (req, res) => {
      const { rue, codePostal, ville, email, numeroTel } = req.body;
      const { idchaine } = req.params;
    
      db.query('INSERT INTO Bureau (rue, codePostal, ville, email, numeroTel, idchaine) VALUES (?, ?, ?, ?, ?, ?)', [rue, codePostal, ville, email, numeroTel, idchaine], (error, results) => {
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
    
  // DELETE /chaines-hotels/{idchaine}

  app.delete('/chaines-hotels/:idchaine', (req, res) => {
    const { idchaine } = req.params;

    const deleteAssociatedData = async () => {
      // Supprimer les commodités associées
      await db.query('DELETE FROM commodite WHERE idchambre IN (SELECT idChambre FROM chambre WHERE idHotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?))', [idchaine]);

      // Supprimer les réservations associées
      await db.query('DELETE FROM reserve WHERE idChambre IN (SELECT idChambre FROM chambre WHERE idHotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?))', [idchaine]);

      // Supprimer les locations associées
      await db.query('DELETE FROM loue WHERE idChambre IN (SELECT idChambre FROM chambre WHERE idHotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?))', [idchaine]);

      // Supprimer les rôles associés
      await db.query('DELETE FROM role WHERE idhotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?)', [idchaine]);

      // Supprimer les employés associés
      await db.query('DELETE FROM employe WHERE idhotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?)', [idchaine]);

      // Supprimer les chambres associées
      await db.query('DELETE FROM chambre WHERE idHotel IN (SELECT idhotel FROM hotel WHERE idchaine = ?)', [idchaine]);

      // Supprimer les hôtels associés
      await db.query('DELETE FROM hotel WHERE idchaine = ?', [idchaine]);

      // Supprimer les bureaux associés
      await db.query('DELETE FROM Bureau WHERE idchaine = ?', [idchaine]);

      // Supprimer la chaîne d'hôtels
      await db.query('DELETE FROM chainehoteliere WHERE idchaine = ?', [idchaine]);
    };

    deleteAssociatedData()
      .then(() => {
        res.send('Chaîne d\'hôtels et données associées supprimées avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de la chaîne d\'hôtels et des données associées:', error);
        res.status(500).send('Erreur lors de la suppression de la chaîne d\'hôtels et des données associées');
      });
  });

  // DELETE /chaines-hotels/{idchaine}/bureaux/{idBureau}
  app.delete('/chaines-hotels/:idchaine/bureaux/:idBureau', (req, res) => {
      const { idchaine, idBureau } = req.params;
      
      db.query('DELETE FROM Bureau WHERE idBureau = ? AND idchaine = ?', [idBureau, idchaine], (error, results) => {
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
  // PUT /chaines-hotels/{idchaine}
  app.put('/chaines-hotels/:idchaine', (req, res) => {
  const { nom, nombrehotel } = req.body;
  const { idchaine } = req.params;

  db.query('UPDATE chainehoteliere SET nom = ?, nombrehotel = ? WHERE idchaine = ?', [nom, nombrehotel, idchaine], (error, results) => {
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
  // PUT /chaines-hotels/{idchaine}/bureaux/{idBureau}
  app.put('/chaines-hotels/:idchaine/bureaux/:idBureau', (req, res) => {
  const { rue, codePostal, ville, email, numeroTel } = req.body;
  const { idchaine, idBureau } = req.params;

  db.query('UPDATE Bureau SET rue = ?, codePostal = ?, ville = ?, email = ?, numeroTel = ? WHERE idBureau = ? AND idchaine = ?', [rue, codePostal, ville, email, numeroTel, idBureau, idchaine], (error, results) => {
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
  
  
// ####### CRUD HOTEL

// POST /hotels
app.post('/hotels', (req, res) => {
  const { idchaine, nom, rue, codePostal, ville, email, numeroTel } = req.body;

  db.query('INSERT INTO hotel (idchaine, nom, rue, codePostal, ville, email, numeroTel) VALUES (?, ?, ?, ?, ?, ?, ?)', [idchaine, nom, rue, codePostal, ville, email, numeroTel], (error, results) => {
    if (error) {
      console.error('Error adding hotel:', error);
      res.status(500).send('Error adding hotel');
      return;
    }

    res.status(201).send('Hotel added successfully');
  });
});
// GET /hotels/:idHotel
app.get('/hotels/:idHotel', (req, res) => {
  const { idHotel } = req.params;

  db.query('SELECT * FROM hotel WHERE idhotel = ?', [idHotel], (error, results) => {
    if (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).send('Error fetching hotel');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Hotel not found');
      return;
    }

    res.send(results[0]);
  });
});
// PUT /hotels/:idHotel
app.put('/hotels/:idHotel', (req, res) => {
  const { idchaine, nom, rue, codePostal, ville, email, numeroTel } = req.body;
  const { idHotel } = req.params;

  //console.log ( req.params)
 // console.log ( req.body)

  db.query('UPDATE hotel SET idchaine = ?, nom = ?, rue = ?, codePostal = ?, ville = ?, email = ?, numeroTel = ? WHERE idhotel = ?', [idchaine, nom, rue, codePostal, ville, email, numeroTel, idHotel], (error, results) => {
    if (error) {
      console.error('Error updating hotel:', error);
      res.status(500).send('Error updating hotel');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Hotel not found');
      return;
    }

    res.send('Hotel updated successfully');
  });
});
// DELETE /hotels/:idHotel
app.delete('/hotels/:idHotel', (req, res) => {
  const { idHotel } = req.params;

  const deleteAssociatedData = async () => {
    await db.query('DELETE FROM commodite WHERE idchambre IN (SELECT idChambre FROM chambre WHERE idHotel = ?)', [idHotel]);
    await db.query('DELETE FROM reserve WHERE idChambre IN (SELECT idChambre FROM chambre WHERE idHotel = ?)', [idHotel]);
    await db.query('DELETE FROM loue WHERE idChambre IN (SELECT idChambre FROM chambre WHERE idHotel = ?)', [idHotel]);
    await db.query('DELETE FROM role WHERE idhotel = ?', [idHotel]);
    await db.query('DELETE FROM employe WHERE idhotel = ?', [idHotel]);
    await db.query('DELETE FROM chambre WHERE idHotel = ?', [idHotel]);
    await db.query('DELETE FROM hotel WHERE idhotel = ?', [idHotel]);
  };

  deleteAssociatedData()
    .then(() => {
      res.send('Hotel and associated data deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting hotel and associated data:', error);
      res.status(500).send('Error deleting hotel and associated data');
    });
});


//   ####### CRUD ROOM  
// Create a room
app.post('/hotels/:idhotel/chambres', (req, res) => {
  const { prix, capaciteChambre, disponible, vue, etendue, problemechambre } = req.body;
  const { idhotel } = req.params;

  db.query('INSERT INTO chambre (prix, capaciteChambre, disponible, vue, etendue, problemechambre, idHotel) VALUES (?, ?, ?, ?, ?, ?, ?)', [prix, capaciteChambre, disponible, vue, etendue, problemechambre, idhotel], (error, results) => {
      if (error) {
          console.error('Error adding chambre:', error);
          res.status(500).send('Error adding chambre');
          return;
      }

      res.status(201).send('Chambre added successfully');
  });
});
// Get a list of rooms
app.get('/hotels/:idhotel/chambres', (req, res) => {
  const { idhotel } = req.params;

  db.query('SELECT * FROM chambre WHERE idHotel = ?', [idhotel], (error, results) => {
      if (error) {
          console.error('Error fetching chambres:', error);
          res.status(500).send('Error fetching chambres');
          return;
      }

      res.send(results);
  });
});
// Update a room
app.put('/hotels/:idhotel/chambres/:idChambre', (req, res) => {
  const { prix, capaciteChambre, disponible, vue, etendue, problemechambre } = req.body;
  const { idhotel, idChambre } = req.params;

  db.query('UPDATE chambre SET prix = ?, capaciteChambre = ?, disponible = ?, vue = ?, etendue = ?, problemechambre = ? WHERE idChambre = ? AND idHotel = ?', [prix, capaciteChambre, disponible, vue, etendue, problemechambre, idChambre, idhotel], (error, results) => {
      if (error) {
          console.error('Error updating chambre:', error);
          res.status(500).send('Error updating chambre');
          return;
      }
      
      if (results.affectedRows === 0) {
          res.status(404).send('Chambre not found');
          return;
      }

      res.send('Chambre updated successfully');
  });
});
// Delete a room
app.delete('/hotels/:idhotel/chambres/:idChambre', (req, res) => {
  const { idhotel, idChambre } = req.params;

  db.query('DELETE FROM reserve WHERE idChambre = ?', [idChambre], (error, results) => {
      if (error) {
          console.error('Error deleting reservations:', error);
          res.status(500).send('Error deleting reservations');
          return;
      }

      db.query('DELETE FROM loue WHERE idChambre = ?', [idChambre], (error, results) => {
          if (error) {
              console.error('Error deleting locations:', error);
              res.status(500).send('Error deleting locations');
              return;
          }

          db.query('DELETE FROM commodite WHERE idchambre = ?', [idChambre], (error, results) => {
              if (error) {
                  console.error('Error deleting commodites:', error);
                  res.status(500).send('Error deleting commodites');
                  return;
              }

              db.query('DELETE FROM chambre WHERE idChambre = ? AND idHotel = ?', [idChambre, idhotel], (error, results) => {
                  if (error) {
                      console.error('Error deleting chambre:', error);
                      res.status(500).send('Error deleting chambre');
                      return;
                  }

                  if (results.affectedRows === 0) {
                      res.status(404).send('Chambre not found');
                      return;
                  }

                  res.send('Chambre and related records deleted successfully');
              });
          });
      });
  });
});


// ####### CRUD comodite

// add comodite
app.post('/chambres/:idChambre/commodites', (req, res) => {
  
  const { nomCommodite } = req.body;
  const idChambre = parseInt(req.params.idChambre);


  db.query('INSERT INTO commodite (nom, idchambre) VALUES (?, ?)', [nomCommodite, idChambre], (error, results) => {
    if (error) {
      console.error('Error adding commodite:', error);
      res.status(500).send('Error adding commodite');
      return;
    }

    res.status(201).send('Commodite added successfully');
  });
});

//supprimer commodite 
app.delete('/commodite', (req, res) => {
  const { idHotel, idChambre, nomCommodite } = req.body;
//console.log(req.body)
  db.query('DELETE FROM commodite WHERE nom = ? AND idChambre = ?', [nomCommodite, idChambre], (error, results) => {
    if (error) {
      console.error('Error deleting commodite:', error);
      res.status(500).send('Error deleting commodite');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Commodite not found');
      return;
    }

    res.send('Commodite deleted successfully');
  });
});



// ####### CRUD employees

// POST /employees
app.post('/employees', (req, res) => {
const { NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel, nomRole, salaireDebut } = req.body;

db.beginTransaction((error) => {
if (error) {
console.error('Error starting transaction:', error);
res.status(500).send('Error adding employee and role');
return;
}


db.query('INSERT INTO employe (NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [NASemploye, prenom, nomFamille, rue, codePostal, ville, username, password, idhotel], (error, results) => {
  if (error) {
    console.error('Error adding employee:', error);
    db.rollback(() => {
      res.status(500).send('Error adding employee and role');
    });
    return;
  }

  db.query('INSERT INTO role (nom, salaireDebut, idhotel, NASemploye) VALUES (?, ?, ?, ?)', [nomRole, salaireDebut, idhotel, NASemploye], (error, results) => {
    if (error) {
      console.error('Error adding role:', error);
      db.rollback(() => {
        res.status(500).send('Error adding employee and role');
      });
      return;
    }

    db.commit((error) => {
      if (error) {
        console.error('Error committing transaction:', error);
        db.rollback(() => {
          res.status(500).send('Error adding employee and role');
        });
        return;
      }

      res.status(201).json({ message: 'Employee and role added successfully' });
    });
  });
});
});
});
// GET /employees/:NASemploye
app.get('/employees/:NASemploye', (req, res) => {
  const { NASemploye } = req.params;
  
  db.query('SELECT * FROM employe WHERE NASemploye = ?', [NASemploye], (error, results) => {
  if (error) {
  console.error('Error fetching employee:', error);
  res.status(500).send('Error fetching employee');
  return;
  }
  

  if (results.length === 0) {
    res.status(404).send('Employee not found');
    return;
  }
  
  res.send(results[0]);
  });
  });
// Update an employee and their role
app.put('/employees/:NASemploye', (req, res) => {
  const { prenom, nomFamille, rue, codePostal, ville, idhotel, nomRole, salaireDebut } = req.body;
  //console.log(req.body)
  db.beginTransaction((error) => {
    if (error) {
      console.error('Error starting transaction:', error);
      res.status(500).send('Error updating employee and role');
      return;
    }

    const { NASemploye } = req.params;

    db.query('UPDATE employe SET prenom = ?, nomFamille = ?, rue = ?, codePostal = ?, ville = ?, idhotel = ? WHERE NASemploye = ?', [prenom, nomFamille, rue, codePostal, ville, idhotel, NASemploye], (error, results) => {
      if (error) {
        console.error('Error updating employee:', error);
        db.rollback(() => {
          res.status(500).send('Error updating employee and role');
        });
        return;
      }

      db.query('UPDATE role SET nom = ?, salaireDebut = ? WHERE NASemploye = ?', [nomRole, salaireDebut, NASemploye], (error, results) => {
        if (error) {
          console.error('Error updating role:', error);
          db.rollback(() => {
            res.status(500).send('Error updating employee and role');
          });
          return;
        }

        db.commit((error) => {
          if (error) {
            console.error('Error committing transaction:', error);
            db.rollback(() => {
              res.status(500).send('Error updating employee and role');
            });
            return;
          }

          res.status(200).send('Employee and role updated successfully');
        });
      });
    });
  });
});
// Update an employee without role
app.put('/employees/:NASemploye/update-info', (req, res) => {
  const { prenom, nomFamille, rue, codePostal, ville, idhotel } = req.body;
  //console.log(req.body);

  const { NASemploye } = req.params;

  db.query('UPDATE employe SET prenom = ?, nomFamille = ?, rue = ?, codePostal = ?, ville = ?, idhotel = ? WHERE NASemploye = ?', [prenom, nomFamille, rue, codePostal, ville, idhotel, NASemploye], (error, results) => {
    if (error) {
      console.error('Error updating employee:', error);
      res.status(500).send('Error updating employee');
      return;
    }

    res.status(200).send('Employee updated successfully');
  });
});
// Delete an employee and their role
app.delete('/employees/:NASemploye', (req, res) => {
  db.beginTransaction((error) => {
    if (error) {
      console.error('Error starting transaction:', error);
      res.status(500).send('Error deleting employee and role');
      return;
    }

    const { NASemploye } = req.params;

    db.query('UPDATE loue SET NASemploye = NULL WHERE NASemploye = ?', [NASemploye], (error, results) => {
      if (error) {
        console.error('Error updating loue:', error);
        db.rollback(() => {
          res.status(500).send('Error deleting employee and role');
        });
        return;
      }

      db.query('DELETE FROM role WHERE NASemploye = ?', [NASemploye], (error, results) => {
        if (error) {
          console.error('Error deleting role:', error);
          db.rollback(() => {
            res.status(500).send('Error deleting employee and role');
          });
          return;
        }

        db.query('DELETE FROM employe WHERE NASemploye = ?', [NASemploye], (error, results) => {
          if (error) {
            console.error('Error deleting employee:', error);
            db.rollback(() => {
              res.status(500).send('Error deleting employee and role');
            });
            return;
          }

          db.commit((error) => {
            if (error) {
              console.error('Error committing transaction:', error);
              db.rollback(() => {
                res.status(500).send('Error deleting employee and role');
              });
              return;
            }

            res.status(200).send('Employee and role deleted successfully');
          });
        });
      });
    });
  });
});




// ####### CRUD locations


// POST /locations
app.post('/locations', (req, res) => {
  const { idChambre, NASclient, NASemploye, checkInDate, checkOutDate, paiement } = req.body;
 // console.log( idChambre, NASclient, NASemploye, checkInDate, checkOutDate, paiement )
  
  db.query('INSERT INTO loue (idChambre, NASclient, NASemploye, checkIndDate , checkOutDate, paiement,archive) VALUES (?, ?, ?, ?, ?, ?,0)', [idChambre, NASclient, NASemploye, checkInDate, checkOutDate, paiement], (error, results) => {
    if (error) {
      console.error('Error adding location:', error);
      res.status(500).send('Error adding location');
      return;
    }

    res.status(201).send('Location added successfully');
    //console.log('ok')
  });
});
// GET /locations/:idLocation
app.get('/locations/:idLocation', (req, res) => {
  const { idLocation } = req.params;

  db.query('SELECT * FROM loue WHERE idLocation = ?', [idLocation], (error, results) => {
    if (error) {
      console.error('Error fetching location:', error);
      res.status(500).send('Error fetching location');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Location not found');
      return;
    }

    res.send(results[0]);
  });
});

// PUT /locations/:idLocation
app.put('/locations/:idLocation', (req, res) => {
  const { idChambre, NASclient, NASemploye, checkIndDate, checkOutDate, paiement } = req.body;
  const { idLocation } = req.params;

  db.query('UPDATE loue SET idChambre = ?, NASclient = ?, NASemploye = ?, checkIndDate = ?, checkOutDate = ?, paiement = ? WHERE idLocation = ?', [idChambre, NASclient, NASemploye, checkIndDate, checkOutDate, paiement, idLocation], (error, results) => {
    if (error) {
      console.error('Error updating location:', error);
      res.status(500).send('Error updating location');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Location not found');
      return;
    }

    res.send('Location updated successfully');
  });
});

// DELETE /locations/:idLocation
app.delete('/locations/:idLocation', (req, res) => {
  const { idLocation } = req.params;

  db.query('DELETE FROM loue WHERE idLocation = ?', [idLocation], (error, results) => {
    if (error) {
      console.error('Error deleting location:', error);
      res.status(500).send('Error deleting location');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Location not found');
      return;
    }

    res.send('Location deleted successfully');
  });
});

// ####### CRUD reservations

// POST /reservations
app.post('/reservations', (req, res) => {
  const { idChambre, NASclient, checkInDate, checkOutDate } = req.body;

  db.query('INSERT INTO reserve (idChambre, NASclient, checkInDate, checkOutDate) VALUES (?, ?, ?, ?)', [idChambre, NASclient, checkInDate, checkOutDate], (error, results) => {
    if (error) {
      console.error('Error adding reservation:', error);
      res.status(500).send('Error adding reservation');
      return;
    }

    res.status(201).send('Reservation added successfully');
  });
});

// GET /reservations/:idReservation
app.get('/reservations/:idReservation', (req, res) => {
  const { idReservation } = req.params;

  db.query('SELECT * FROM reserve WHERE idReservation = ?', [idReservation], (error, results) => {
    if (error) {
      console.error('Error fetching reservation:', error);
      res.status(500).send('Error fetching reservation');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Reservation not found');
      return;
    }

    res.send(results[0]);
  });
});

// PUT /reservations/:idReservation
app.put('/reservations/:idReservation', (req, res) => {
  const { idChambre, NASclient, checkInDate, checkOutDate } = req.body;
  const { idReservation } = req.params;

  db.query('UPDATE reserve SET idChambre = ?, NASclient = ?, checkInDate = ?, checkOutDate = ? WHERE idReservation = ?', [idChambre, NASclient, checkInDate, checkOutDate, idReservation], (error, results) => {
    if (error) {
      console.error('Error updating reservation:', error);
      res.status(500).send('Error updating reservation');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Reservation not found');
      return;
    }

    res.send('Reservation updated successfully');
  });
});

// DELETE /reservations/:idReservation
app.delete('/reservations/:idReservation', (req, res) => {
  const { idReservation } = req.params;
  
  db.query('DELETE FROM reserve WHERE idReservation = ?', [idReservation], (error, results) => {
    if (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).send('Error deleting reservation');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Reservation not found');
      return;
    }

    res.send('Reservation deleted successfully');
   // console.log(idReservation);

   // console.log('Reservation deleted successfully');
    
  });
});


// ####### CRUD clients

// POST /clients
  app.post('/clients', (req, res) => {
  const { NASclient, prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password } = req.body;

  db.query('INSERT INTO client (NASclient, prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [NASclient, prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password], (error, results) => {
    if (error) {
      console.error('Error adding client:', error);
      res.status(500).send('Error adding client');
      return;
    }

    res.status(201).json({ message: 'Client added successfully' });
  });
});

// GET /clients/:NASclient
app.get('/clients/:NASclient', (req, res) => {
  const { NASclient } = req.params;

  db.query('SELECT * FROM client WHERE NASclient = ?', [NASclient], (error, results) => {
    if (error) {
      console.error('Error fetching client:', error);
      res.status(500).send('Error fetching client');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Client not found');
      return;
    }

    res.send(results[0]);
  });
});

// Update a client
app.put('/clients/:NASclient', (req, res) => {
  const { prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password } = req.body;

  const { NASclient } = req.params;

  db.query('UPDATE client SET prenom = ?, nomFamille = ?, rue = ?, codePostal = ?, ville = ?, dateEnregistrement = ?, username = ?, password = ? WHERE NASclient = ?', [prenom, nomFamille, rue, codePostal, ville, dateEnregistrement, username, password, NASclient], (error, results) => {
    if (error) {
      console.error('Error updating client:', error);
      res.status(500).send('Error updating client');
      return;
    }

    res.status(200).send('Client updated successfully');
  });
});

// Delete a client
app.delete('/clients/:NASclient', (req, res) => {
  const { NASclient } = req.params;

  db.query('DELETE FROM client WHERE NASclient = ?', [NASclient], (error, results) => {
    if (error) {
      console.error('Error deleting client:', error);
      res.status(500).send('Error deleting client');
      return;
    }

    res.status(200).send('Client deleted successfully');
  });
});


//   ####### requests Dashboard employee
//mainprofile 
// Endpoint pour la requête username
app.get('/mainProfileInfos', (req, res) => {
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

//chaines hotelieres :
app.get('/hotelInfo', (req, res) => {
  const token = req.headers.authorization;

  const username = users[token];
 // console.log(token)
  if (!username) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const query = `
    SELECT
      ch.idchaine AS ch_idchaine,
      ch.nom AS ch_nom,
      ch.nombrehotel AS ch_nombrehotel,
      b.idBureau AS b_idBureau,
      b.rue AS b_rue,
      b.codePostal AS b_codePostal,
      b.ville AS b_ville,
      b.email AS b_email,
      b.numeroTel AS b_numeroTel,
      b.idchaine AS b_idchaine
    FROM
      employe e
      JOIN hotel h ON e.idhotel = h.idhotel
      JOIN chainehoteliere ch ON h.idchaine = ch.idchaine
      LEFT JOIN Bureau b ON ch.idchaine = b.idchaine
    WHERE
      e.username = ?;
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching data' });
      console.error(err);
      return;
    }

    const hotelData = {
      chaineHoteliere: {},
      bureaux: [],
      hotels: []
    };

    results.forEach(row => {
      if (!hotelData.chaineHoteliere.idchaine) {
        hotelData.chaineHoteliere = {
          idchaine: row.ch_idchaine,
          nom: row.ch_nom,
          nombrehotel: row.ch_nombrehotel
        };
      }

      if (row.b_idBureau) {
        hotelData.bureaux.push({
          idBureau: row.b_idBureau,
          rue: row.b_rue,
          codePostal: row.b_codePostal,
          ville: row.b_ville,
          email: row.b_email,
          numeroTel: row.b_numeroTel,
          idchaine: row.b_idchaine
        });
      }
    });

    const hotelQuery = `
      SELECT
        h.idhotel,
        h.nom,
        h.classement,
        h.nombrechambres,
        h.rue,
        h.codePostal,
        h.ville,
        h.email,
        h.numeroTel,
        h.idchaine
      FROM
        hotel h
      WHERE
        h.idchaine = ?;
    `;

    db.query(hotelQuery, [hotelData.chaineHoteliere.idchaine], (err, hotelResults) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching hotel data' });
        console.error(err);
        return;
      }

      hotelData.hotels = hotelResults;
      //console.log(hotelData)
      res.json(hotelData);
    });
  });
});

//hotel : 
app.get('/chambreinfos', (req, res) => {
  const username = users[req.headers.authorization];
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  const hotelQuery = `SELECT hotel.idhotel, hotel.nom, hotel.rue, hotel.codePostal, hotel.ville
                      FROM hotel
                      JOIN employe ON employe.idhotel = hotel.idhotel
                      WHERE employe.username = ?`;

                      const chambreQuery = `SELECT chambre.idChambre, chambre.prix, chambre.capaciteChambre, chambre.disponible, chambre.vue, chambre.etendue, chambre.problemechambre, GROUP_CONCAT(commodite.nom SEPARATOR ', ') AS commodites
                      FROM chambre
                      JOIN hotel ON hotel.idhotel = chambre.idHotel
                      JOIN employe ON employe.idhotel = hotel.idhotel
                      LEFT JOIN commodite ON commodite.idchambre = chambre.idChambre
                      WHERE employe.username = ?
                      GROUP BY chambre.idChambre`;


  db.query(hotelQuery, [username], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const hotel = {
      idhotel: hotelResult[0].idhotel,
      nom: hotelResult[0].nom,
      rue: hotelResult[0].rue,
      codePostal: hotelResult[0].codePostal,
      ville: hotelResult[0].ville,
    };

    db.query(chambreQuery, [username], (err, chambreResult) => {
      if (err) {
        console.error('Error executing get chambres query:', err);
        res.status(500).send('Error fetching chambre infos');
        return;
      }

      const chambres = chambreResult.map(row => ({
        idChambre: row.idChambre,
        prix: row.prix,
        capaciteChambre: row.capaciteChambre,
        disponible: row.disponible,
        vue: row.vue,
        etendue: row.etendue,
        problemechambre: row.problemechambre,
        commodites: row.commodites,
      }));

      const chambreInfo = {
        chambres,
        hotel,
      };
      //console.log(chambreInfo)
      res.send(chambreInfo);
    });
  });
});

app.get('/employeinfos', (req, res) => {
  const username = users[req.headers.authorization];
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  const hotelQuery = `SELECT hotel.idhotel
                      FROM hotel
                      JOIN employe ON employe.idhotel = hotel.idhotel
                      WHERE employe.username = ?`;

  const employeRoleInfoQuery = `SELECT employe.NASemploye, employe.prenom, employe.nomFamille, employe.rue, employe.codePostal, employe.ville, role.nom AS role, role.salaireDebut
                                FROM employe
                                JOIN role ON role.NASemploye = employe.NASemploye
                                WHERE employe.idhotel = ?`;

  db.query(hotelQuery, [username], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const idhotel = hotelResult[0].idhotel;

    db.query(employeRoleInfoQuery, [idhotel], (err, employeRoleInfoResult) => {
      if (err) {
        console.error('Error executing get employe and role info query:', err);
        res.status(500).send('Error fetching employe and role infos');
        return;
      }

      const employes = employeRoleInfoResult.map(row => ({
        NASemploye: row.NASemploye,
        prenom: row.prenom,
        nomFamille: row.nomFamille,
        rue: row.rue,
        codePostal: row.codePostal,
        ville: row.ville,
        role: row.role,
        salaireDebut: row.salaireDebut,
      }));

      res.send(employes);
      //console.log(employes)
    });
  });
});

// Endpoint pour récupérer les informations de location pour l'employé connecté
app.get('/locationInfos', (req, res) => {
  const username = users[req.headers.authorization];
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  // Query to get the ID of the hotel where the employee works
  const hotelQuery = `
    SELECT idhotel
    FROM employe
    WHERE username = ?;
  `;

  // Query to get the information of all rooms in the hotel
  const chambreQuery = `
    SELECT *
    FROM chambre
    WHERE idHotel = ?;
  `;

  // Query to get the information of all employees at the hotel (except for the current employee)
  const employeQuery = `
    SELECT *
    FROM employe
    WHERE idhotel = ? AND username != ?;
  `;

  // Query to get all current room rentals at the hotel where the employee works
  const locationQuery = `
    SELECT *
    FROM loue
    WHERE idChambre IN (
      SELECT idChambre
      FROM chambre
      WHERE idHotel = ?
    ) ;
  `;

  // Get the ID of the hotel where the employee works
  db.query(hotelQuery, [username], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const hotelId = hotelResult[0].idhotel;

    // Get the information of all rooms in the hotel
    db.query(chambreQuery, [hotelId], (err, chambreResult) => {
      if (err) {
        console.error('Error executing get chambre query:', err);
        res.status(500).send('Error fetching chambre infos');
        return;
      }

      const chambres = chambreResult;

      // Get the information of all employees at the hotel (except for the current employee)
      db.query(employeQuery, [hotelId, username], (err, employeResult) => {
        if (err) {
          console.error('Error executing get employe query:', err);
          res.status(500).send('Error fetching employe infos');
          return;
        }

        const employes = employeResult;

        // Get all current room rentals at the hotel where the employee works
        db.query(locationQuery, [hotelId], (err, locationResult) => {
          if (err) {
            console.error('Error executing get location query:', err);
            res.status(500).send('Error fetching location infos');
            return;
          }

          const locations = locationResult;
        //  console.log('Locations:', locations);

          // Combine all query results into a single object and send it as the response
          const locationInfos = {
            chambres,
            employes,
            locations,
          };

          res.json(locationInfos);
        });
      });
    });
  });
});

// Endpoint to get reservation information for the connected employee
app.get('/reservationInfos', (req, res) => {
  const username = users[req.headers.authorization];
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  // Query to get the ID of the hotel where the employee works
  const hotelQuery = `
    SELECT idhotel
    FROM employe
    WHERE username = ?;
  `;

  // Query to get the information of all rooms in the hotel
  const chambreQuery = `
    SELECT *
    FROM chambre
    WHERE idHotel = ?;
  `;

  // Query to get the information of all employees at the hotel (except for the current employee)
  const employeQuery = `
    SELECT *
    FROM employe
    WHERE idhotel = ? AND username != ?;
  `;

  // Query to get all current reservations at the hotel where the employee works
  const reservationQuery = `
    SELECT *
    FROM reserve
    WHERE idChambre IN (
      SELECT idChambre
      FROM chambre
      WHERE idHotel = ?
    );
  `;

  // Get the ID of the hotel where the employee works
  db.query(hotelQuery, [username], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const hotelId = hotelResult[0].idhotel;

    // Get the information of all rooms in the hotel
    db.query(chambreQuery, [hotelId], (err, chambreResult) => {
      if (err) {
        console.error('Error executing get chambre query:', err);
        res.status(500).send('Error fetching chambre infos');
        return;
      }

      const chambres = chambreResult;

      // Get the information of all employees at the hotel (except for the current employee)
      db.query(employeQuery, [hotelId, username], (err, employeResult) => {
        if (err) {
          console.error('Error executing get employe query:', err);
          res.status(500).send('Error fetching employe infos');
          return;
        }

        const employes = employeResult;

        // Get all current reservations at the hotel where the employee works
        db.query(reservationQuery, [hotelId], (err, reservationResult) => {
          if (err) {
            console.error('Error executing get reservation query:', err);
            res.status(500).send('Error fetching reservation infos');
            return;
          }

          const reservations = reservationResult;

          // Combine all query results into a single object and send it as the response
          const reservationInfos = {
            chambres,
            employes,
            reservations,
          };

          res.json(reservationInfos);
          //console.log(reservationInfos.reservations)
          //console.log(reservationInfos.reservations.le)
        });
      });
    });
  });
});

app.get('/clients-with-reservation-or-rental', (req, res) => {
  const username = users[req.headers.authorization];
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  // Query to get the ID of the hotel where the employee works
  const hotelQuery = `
    SELECT idhotel
    FROM employe
    WHERE username = ?;
  `;

  // Query to get the clients who have a reservation or rental in a room at the same hotel
  const clientQuery = `
  SELECT DISTINCT client.*
  FROM client
  INNER JOIN reserve ON reserve.NASclient = client.NASclient
  INNER JOIN chambre ON chambre.idChambre = reserve.idChambre
  WHERE chambre.idHotel = ?
         OR EXISTS (
           SELECT 1
           FROM loue
           WHERE loue.idChambre = chambre.idChambre
         );
`;


  // Get the ID of the hotel where the employee works
  db.query(hotelQuery, [username], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const hotelId = hotelResult[0].idhotel;

    // Get the clients who have a reservation or rental in a room at the same hotel
    db.query(clientQuery, [hotelId], (err, clientResult) => {
      if (err) {
        console.error('Error executing get client query:', err);
        res.status(500).send('Error fetching client infos');
        return;
      }

      const clients = clientResult;

      res.json(clients);
    });
  });
});

// Endpoint to convert a reservation to a rental
app.post('/convertReservationToRental', (req, res) => {
  const username = users[req.headers.authorization];

console.log('Username:', username);

  // Check if the user is authenticated with a valid token
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }

  // Get the employee's NAS number from the database
  const nasQuery = `
    SELECT NASemploye
    FROM employe
    WHERE username = ?;
  `;
  db.query(nasQuery, [username], (err, result) => {
    if (err || result.length === 0) {
      console.error('Error executing get NAS query:', err);
      res.status(500).send('Error fetching employee info');
      return;
    }

    const nas = result[0].NASemploye;

    // Check if all required information is provided in the request body
    const { idReservation, idChambre, NASclient, checkIndDate, checkOutDate, paiement } = req.body;
    if (!idReservation || !idChambre || !NASclient || !checkIndDate || !checkOutDate || !paiement) {
      res.status(400).send('Missing required information');
      return;
    }

    // Check if the employee works at the same hotel as the room
    const hotelQuery = `
      SELECT idHotel
      FROM chambre
      WHERE idChambre = ?;
    `;
    db.query(hotelQuery, [idChambre], (err, result) => {
      if (err || result.length === 0) {
        console.error('Error executing get hotel query:', err);
        res.status(500).send('Error fetching hotel info');
        return;
      }

      const hotelId = result[0].idHotel;

      const employeQuery = `
        SELECT *
        FROM employe
        WHERE idHotel = ? AND NASemploye != ?;
      `;
      db.query(employeQuery, [hotelId, nas], (err, result) => {
        if (err) {
          console.error('Error executing get employe query:', err);
          res.status(500).send('Error fetching employee info');
          return;
        }

        if (result.length === 0) {
          res.status(403).send('Cannot convert reservation to rental for a room in another hotel');
          return;
        }

        // Insert the new rental into the database
        const insertQuery = `
          INSERT INTO loue (idChambre, NASclient, NASemploye, checkIndDate, checkOutDate, paiement)
          VALUES (?, ?, ?, ?, ?, ?);
        `;
        db.query(insertQuery, [idChambre, NASclient, nas, checkIndDate, checkOutDate, paiement], (err, result) => {
          if (err) {
            console.error('Error executing insert query:', err);
            res.status(500).send('Error converting reservation to rental');
            return;
          }

          // Update the reservation to be archived
          const updateQuery = `
            UPDATE reserve
            SET archive = true
            WHERE idReservation = ?;
          `;
          db.query(updateQuery, [idReservation], (err, result) => {
            if (err) {
              console.error('Error executing update query:', err);
              res.status(500).send('Error converting reservation to rental');
              return;
            }

            res.status(200).send('Reservation converted to rental successfully');
            console.log('Reservation converted to rental successfully')
          });
        });
      });
    });
  });
});


app.get('/randomEmployee', (req, res) => {
    db.query('SELECT username, password FROM employe ORDER BY RAND() LIMIT 1', (error, results, fields) => {
      if (error) throw error;
      res.send(JSON.stringify(results[0]));
    });
  });
      
          




// Route pour la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  //console.log(req.body)
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




app.post('/bureau', (req, res) => {
  //console.log(req.body)
  const data = req.body


  const { nomBureau, rueBureau, codePostalBureau, villeBureau, emailBureau, numeroTelBureau, idHotel } = req.body;
  //console.log([data.chainehoteliere, data.rue, data.codePostal, data.ville, data.email, data.numeroTel])
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


//================ CLIENT ============
app.post('/loginClient', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  // Check if user exists and password is correct in the database
  db.query('SELECT * FROM client WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).send('Username or password incorrect');
    }
    const token = generateToken(username);
    // Add user to dictionary with token as key and username as value
    users[token] = username;
    res.json({ token });
  });
});

app.get('/randomClient', (req, res) => {
  db.query('SELECT username, password FROM client ORDER BY RAND() LIMIT 1', (error, results, fields) => {
    if (error) throw error;
    res.send(JSON.stringify(results[0]));
  });
});

//================ QUESTION 10  ===================
app.get('/vue1', (req, res) => {
  let sql = 'CREATE VIEW nombre_chambres_disponibles_par_zone AS SELECT zone, COUNT(*) AS nombre_chambres_disponibles FROM chambre WHERE disponible = 1 GROUP BY ville';
  db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send('Vue 1 created: Nombre de chambres disponibles par zone');
  });
});
// Exemple requete pour utiliser vue1:
// SELECT * FROM nombre_chambres_disponibles_par_zone;


app.get('/vue2', (req, res) => {
  let sql = 'CREATE VIEW capacite_chambres_hotel_specifique AS SELECT hotel, SUM(capaciteChambre) AS capacite_totale FROM chambre GROUP BY hotel';
  db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send('Vue 2 created: Capacité de toutes les chambres d un hôtel spécifique');
  });
});
// Exemple requete pour utiliser vue2:
// SELECT capacite_totale FROM capacite_chambres_hotel_specifique WHERE hotel = 'nom_de_l_hotel';

// Disponibiltes des chambres pour client
app.get('/chambreinfosForClient/:idhotel', (req, res) => {
  const username = users[req.headers.authorization];
  const {idhotel} = req.params;
  //console.log(idhotel)
  if (!username) {
    res.status(401).send('Invalid token');
    return;
  }
  const hotelQuery = `SELECT hotel.idhotel, hotel.nom, hotel.rue, hotel.codePostal, hotel.ville
  FROM hotel
  WHERE hotel.idhotel = ?`;

  const chambreQuery = `SELECT chambre.idChambre, chambre.prix, chambre.capaciteChambre, chambre.disponible, chambre.vue, chambre.etendue, chambre.problemechambre, GROUP_CONCAT(commodite.nom SEPARATOR ', ') AS commodites
  FROM chambre
  JOIN hotel ON hotel.idhotel = chambre.idHotel
  LEFT JOIN commodite ON commodite.idchambre = chambre.idChambre
  WHERE chambre.idhotel = ? AND chambre.disponible = 1 AND chambre.problemechambre= 0
  GROUP BY chambre.idChambre`;


  db.query(hotelQuery, [idhotel], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      console.error('Error executing get hotel query:', err);
      res.status(500).send('Error fetching hotel info');
      return;
    }

    const hotel = {
      idhotel: hotelResult[0].idhotel,
      nom: hotelResult[0].nom,
      rue: hotelResult[0].rue,
      codePostal: hotelResult[0].codePostal,
      ville: hotelResult[0].ville,
    };

    db.query(chambreQuery, [idhotel], (err, chambreResult) => {
      if (err) {
        console.error('Error executing get chambres query:', err);
        res.status(500).send('Error fetching chambre infos');
        return;
      }

      const chambres = chambreResult.map(row => ({
        idChambre: row.idChambre,
        prix: row.prix,
        capaciteChambre: row.capaciteChambre,
        disponible: row.disponible,
        vue: row.vue,
        etendue: row.etendue,
        problemechambre: row.problemechambre,
        commodites: row.commodites,
      }));

      const chambreInfo = {
        chambres,
        hotel,
      };
     // console.log(chambreInfo)
      res.send(chambreInfo);
    });
  });
});

