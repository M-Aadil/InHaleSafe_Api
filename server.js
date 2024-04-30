/*const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Importing file system module

const app = express(); // Creating an express object
const port = 8000; // Setting a port for this application

let sensorData = []; // Array to store sensor data
const MAX_SENSOR_DATA = 30; 

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
});*/


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 8000;

// MongoDB Atlas connection string
const connectionString = 'mongodb+srv://Aadil:Aadil123@cluster0.dn3tm0i.mongodb.net/';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

    const sensorDataSchema = new mongoose.Schema({
        CO: Number,
        CO2: Number,
        Temperature: Number,
        Pressure: Number,
        Humidity: Number,
        Gas: Number,
        AQI: Number,
        VOC: Number,
        Timestamp:  String
    }, { timestamps: true });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.listen(port, function () {
    console.log("Server has been started at port " + port);
});

app.get('/sensor-data', async function (req, res) {
    try {
        const data = await SensorData.find({});
        res.json(data);
    } catch (err) {
        console.error("Error fetching sensor data:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/sensor-data', async function (req, res) {
    const jsonData = req.body;

    console.log("Received JSON data:", jsonData);

    try {
        const savedData = await SensorData.create(jsonData);
        res.json(savedData);
    } catch (err) {
        console.error("Error saving sensor data:", err);
        res.status(500).json({ error: 'Failed to save sensor data' });
    }
});

