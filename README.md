# Steps to run the backend

## Installation and configuration

1. Install Node.js
2. Install [MySQL] (https://dev.mysql.com/downloads/mysql/)
3. Install [XAMPP] (https://www.apachefriends.org/)

- Start XAMPP: Open the XAMPP control panel and start the Apache and MySQL services.
- Open phpAdmin

## Commands to run

Open the terminal and navigate to the directory containing `package.json`
Run the following commands:

1. `npm install --save mysql express`
2. `npm install -g nodemon`
3. `nodemon`

Go to http://localhost:3000/ to check if the server started on port 3000 (this port is configured in `app.js`)
