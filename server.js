const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Importing file system module

const app = express(); // Creating an express object
const port = 8000; // Setting a port for this application

let sensorData = []; // Array to store sensor data
const MAX_SENSOR_DATA = 26; 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname));

// Starting server using listen function
app.listen(port, function (err) {
    if (err) {
        console.log("Error while starting server");
    } else {
        console.log("Server has been started at " + port);
    }
});

// Route to serve the HTML page with sensor data
app.get('/sensor-data', function (req, res) {
    // Respond with the sensor data as JSON
    res.json(sensorData);
});

// Endpoint to receive sensor data via POST request
app.post('/sensor-data', function (req, res) {
    // Get the JSON data from the request body
    const jsonData = req.body;

    // Print the JSON data to the console
    console.log("Received JSON data:", jsonData);

    // Add received data to sensorData array
    sensorData.push(jsonData);

    if (sensorData.length > MAX_SENSOR_DATA) {
        sensorData = [];
    }

    // Send the updated sensor data back to the client as JSON
    res.json(sensorData);
});
