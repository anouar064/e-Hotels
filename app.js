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


// jQuery code to populate the dropdown list with chaines hotellieres
$(document).ready(function() {
    // Get the list of chaines hotellieres from the server using AJAX
    $.get('/api/chaineshotellieres', function(data) {
      // Loop through the array of chaines hotellieres and append them to the dropdown list
      data.forEach(function(chainehoteliere) {
        $('#chainehoteliere-dropdown').append($('<option>', {
          value: chainehoteliere.idchaine,
          text: chainehoteliere.nom
        }));
      });
    });
    
    // Handle form submission
    $('#chainehoteliere-form').submit(function(event) {
      event.preventDefault(); // prevent the default form submission
      
      // Get the selected chainehoteliere ID from the dropdown list
      var chainehoteliereId = $('#chainehoteliere-dropdown').val();
      
      // Do something with the selected chainehoteliere ID, e.g. redirect to a page with more details
      window.location.href = '/chainehoteliere/' + chainehoteliereId;
    });
  });
  