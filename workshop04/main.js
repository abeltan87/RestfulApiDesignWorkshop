const { join } = require('path');

const cacheControl = require('express-cache-controller')
const preconditions = require('express-preconditions')
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
//
//Disable etag for this workshop
app.set('etag', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start of workshop
//
// TODO 1/2 OpenAPI 
app.use(
    OpenAPIValidator.middleware({
        apiSpec: '' // OpenAPI spec here, copy from workshop03
    })
)

// TODO 2/2 Copy your routes from workshop03 here

