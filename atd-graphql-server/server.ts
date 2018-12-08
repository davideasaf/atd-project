import * as express from 'express';
import * as cors from 'cors';
import postgraphile from 'postgraphile';

const app = express();
const port = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['POST', 'GET'],
};

app.options('*', cors());
app.use(cors(corsOptions));

app.use(
  postgraphile(DATABASE_URL, {
    graphiql: true,
  }),
);

app.listen(port), () => console.log(`listening on ${port}`);
