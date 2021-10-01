const range = require('express-range')
const compression = require('compression')

const express = require('express')

const data = require('./zips')
const CitiesDB = require('./zipsdb')

//Load application keys
const db = CitiesDB(data);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start of workshop

// Mandatory workshop
// TODO GET /api/states
// Use db.findAllStates()


// TODO GET /api/state/:state
// Use db.findCitiesByState(:state, { limit?: 10, offset?: 0 })
// 2nd parameter is optional


// TODO GET /api/city/:cityId
// Use db.findCityById(:id) returns null if not found


// TODO POST /api/city
// Use db.insertCity(cityDetails)

// Optional workshop
// TODO HEAD /api/state/:state
// IMPORTANT: HEAD must be place before GET for the
// same resource. Otherwise the GET handler will be invoked
// use db.countCitiesInState(:state)


// TODO GET /state/:state/count
// use db.countCitiesInState(:state)


// TODO GET /api/city/:name
// Use db.findCityByName(:name) 


// End of workshop

const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`);
});

