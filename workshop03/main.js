const { join } = require('path');
const fs = require('fs');

const cors = require('cors');
const range = require('express-range')
const compression = require('compression')

const  OpenAPIValidator  = require('express-openapi-validator')

const express = require('express')

const data = require('./zips')
const CitiesDB = require('./zipsdb')

//Load application keys
const db = CitiesDB(data);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('api/states', (req, resp) => {
    let result = db.findAllStates();
    resp.status(200).json(result);
});

let cityStates = db.findCitiesByState(state, {limit:30, offset:0});

app.get('api/city/:cityId', (req, resp) => {
	let cityId = req.params.cityId;
    let result = db.findCityById(cityId);
	if(result != null)
		resp.status(200).json(result);
	else
		resp.status(200).json(null);
});

app.post('/api/city', (req, resp) => {
	let cityDetails = req.params.cityDetails;
	let result = db.insertCity(cityDetails);
	resp.status(200).json(result);
});

app.use('/schema', express.static(join(__dirname, 'schema')));

app.use((error, req, resp, next) => {

	console.error('Error: ', error)

	return resp.status(error.status || 500)
		.type('application/json').json({ error: error });
});

const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
		console.info(`Application started on port ${PORT} at ${new Date()}`);
});
