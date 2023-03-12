const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eHotel',

  port: 3306
});
  
db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySql:', error);
        return;
    }
    console.log('MySql connected...');
});

const app = express();

// Create DB (can be done manually with phpadmin interface)
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE eHotel';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('database created...');
    });
});

// Create client table
app.get('/createclienttable', (req, res) => {
    let sql = 'CREATE TABLE client(NASclient INTEGER(9) PRIMARY KEY, \
    Prenom VARCHAR(255), NomFamille VARCHAR(255), Rue VARCHAR(255), \
    CodePostal VARCHAR(10), Ville VARCHAR(255), DateEnregistrement DATE)';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Posts table created...');
    });
});

app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});
