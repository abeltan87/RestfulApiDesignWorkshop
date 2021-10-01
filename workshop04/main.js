const { join } = require("path");

const cacheControl = require("express-cache-controller");
const preconditions = require("express-preconditions");
const cors = require("cors");
const range = require("express-range");
const compression = require("compression");

const OpenAPIValidator = require("express-openapi-validator");

const express = require("express");

const data = require("./zips");
const CitiesDB = require("./zipsdb");

//Load application keys
const db = CitiesDB(data);

const app = express();
//
//Disable etag for this workshop
app.set("etag", false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cacheControl({ maxAge: 60 }));

// Start of workshop
//
// TODO 1/2 Load schemas
app.use(
  OpenAPIValidator.middleware({
    apiSpec: join(__dirname, "schema", "city-api.yaml"),
  })
);

// TODO 2/2 Copy your routes from workshop03 here

// Mandatory workshop
// TODO GET /api/states
// Use db.findAllStates()
app.get("/api/states", (req, resp) => {
  resp.cacheControl = {
    maxAge: 30,
  };
  let result = db.findAllStates();
  resp.status(200).json(result);
});

// TODO GET /api/state/:state
// Use db.findCitiesByState(:state, { limit?: 10, offset?: 0 })
// 2nd parameter is optional
app.get("/api/state/:state", (req, resp) => {
  let result = db.findCitiesByState(req.params.state, {
    limit: req.query.limit,
    offset: req.query.offset,
  });
  let cityCount = db.countCitiesInState(req.params.state);
  resp.cacheControl = {
    maxAge: 120,
  };
  resp
    .set("Accept-Ranges", "items")
    .set("Accept-Encoding", "gzip")
    .set("ETag", `"${req.params.state.toLowerCase()}${cityCount}"`);
  resp.status(200).json(result);
});

// TODO GET /api/city/:cityId
// Use db.findCityById(:id) returns null if not found
app.get("/api/city/:cityId", (req, resp) => {
  let result = db.findCityById(req.params.cityId);
  if (result == null) resp.status(400).json([]);
  else resp.status(200).json([result]);
});

// TODO POST /api/city
// Use db.insertCity(cityDetails)

// Optional workshop
// TODO HEAD /api/state/:state
// IMPORTANT: HEAD must be place before GET for the
// same resource. Otherwise the GET handler will be invoked
// use db.countCitiesInState(:state)

// TODO GET /state/:state/count
// use db.countCitiesInState(:state)
app.get("/api/:state/count", (req, resp) => {
  let count = db.countCitiesInState(req.params.state);
  resp.status(200).json({ state: req.params.state, cities: count });
});

// TODO GET /api/city/:name
// Use db.findCityByName(:name)
app.get("/api/cities/:name", (req, resp) => {
  let result = db.findCitiesByName(req.params.name);
  resp.status(200).json(result);
});

// End of workshop

app.use("/schema", express.static(join(__dirname, "schema")));

app.use((error, req, resp, next) => {
  console.error("Error: ", error);

  return resp
    .status(error.status || 500)
    .type("application/json")
    .json({ error: error });
});

const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
  console.info(`Application started on port ${PORT} at ${new Date()}`);
});
