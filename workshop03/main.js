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

// Start of workshop

// TODO 1/2 Load schemas
app.use(
	OpenAPIValidator.middleware({
		apiSpec: '' // OpenAPI spec here
	})
)
	
// Start of workshop
// TODO 2/2 Copy your routes from workshop02 here

// End of workshop

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
