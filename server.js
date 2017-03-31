import Express from 'express';
import GraphHTTP from 'express-graphql';
import schema from './schemas/index';

const APP_PORT = process.env.APP_PORT || 3000;
const APP = Express();

APP.set('port', APP_PORT);

APP.get('/', (req, res) => {
  res.send('Hello!');
});

APP.use('/graphql', GraphHTTP({
  schema,
  graphiql: true
}));

APP.listen(APP_PORT, ()=>
  console.log(`listent to port ${APP_PORT}`)
);
