import * as express from 'express';
import * as cors from 'cors';
import postgraphile from 'postgraphile';

const app = express();
const port = process.env.PORT || 5000;

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ? process.env.DB_PORT : 5432;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const databaseConnString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
console.log('databaseConnString:', databaseConnString);

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['POST', 'GET'],
};

app.options('*', cors());
app.use(cors(corsOptions));

app.use(postgraphile(databaseConnString, { graphiql: true }));

app.listen(port), () => console.log(`listening on ${port}`);
