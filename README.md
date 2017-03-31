# GraphQL

A GraphQL example app.

## Create App Folder
```
mkdir graphql
```

## NPM Init
```
cd graphql
npm init // follow instructions

update package.json
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

## Setup Babel
```
Install package
  npm i --save babel-preset-node6-es6

create .babelrc and add node6 presets
  touch .babelrc

add to .babelrc
  {
    "presets": [
      "node6-es6"
    ]
  }
```

## Setup jshintrc

prevents jrhint from highlighting/warning es6 features

```
create .jshintrc
  touch .jshintrc

add to .jshintrc
  {
    "esversion": 6
  }
```

## Setup Express Server
```
Install packages
  npm i --save express babel-register babel-polyfill

create index.js and server.js
  touch index.js server.js

add to server.js

  import Express from 'express';

  const APP_PORT = process.env.APP_PORT || 3000;
  const APP = Express();

  APP.set('port', APP_PORT);

  APP.get('/', (req, res) => {
    res.send('Hello!');
  });

  APP.listen(APP_PORT, ()=>
    console.log(`listent to port ${APP_PORT}`)
  );

add to index.js
  require('babel-register');
  require('babel-polyfill');
  require('./server');

test server
  npm start
  http://localhost:3000/
```

## Setup Database
```
npm install --save sequelize
npm install --save tedious // mysql driver
npm install -g mysql // if receive error

create database folder and mysql.js
  mkdir database
  touch database/mysql.js

add connection  
  import Sequelize from 'sequelize';

  const Conn = new Sequalize(
    'graphql',
    'root',
    '',
    {
      dialect: 'mysql',
      host: 'localhost',
      post: 3306
    });

add user table
  const User = Conn.define('user', {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  });

add post table
  const Post = Conn.define('post', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

create associations
  User.hasMany(Post);
  Post.belongsTo(User);

create seed data
  npm i --save faker lodash

  add faker and lodash import

  const userSeed = () => User.create({
    username: Faker.internet.userName(),
    first_name: Faker.name.firstName(),
    last_name: Faker.name.lastName(),
    email: Faker.internet.email()
  });

  const postSeed = (user) => user.createPost({
    title: `Title by ${user.username}`,
    content: `Content by ${user.first_name} ${user.last_name}`
  });

  // Build Seed
  Conn.sync({force: true})
    .then(() =>
      _.times(10, () =>
        userSeed()
          .then(user => postSeed(user))
      )
    );

export file
  export default Conn

Test / Run The File
  npm install -g babel-cli
  npm install --save-dev babel-cli // this doesn't work for me

  babel-node database/mysql.js
```

## Setup GraphQL Schema
```
Create schemas folder
  mkdir schemas

Install packages
  npm install --save graphql express-graphql
  if graphql can't be installed, add "graphql": "0.9.1" direct to package.json and then run npm install.

create userType.js
  touch schemas/userType.js

add to userType.js
  import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
  } from 'graphql';
  import PostType from './postType';
  import Db from '../database/mysql';

  const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User Schema',
    fields: () => {
      return {
        id: {
          type: GraphQLInt,
          resolve: user => user.id
        },
        username: {
          type: GraphQLString,
          resolve: user => user.username
        },
        first_name: {
          type: GraphQLString,
          resolve: user => user.first_name
        },
        last_name: {
          type: GraphQLString,
          resolve: user => user.last_name
        },
        email: {
          type: GraphQLString,
          resolve: user => user.email
        },
        posts: {
          type: new GraphQLList(PostType),
          resolve: user => user.getPosts()
        }
      };
    }
  });

  export default UserType;

create postType.js
  touch schemas/postType.js

add to postType.js
  import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString
  } from 'graphql';
  import UserType from './userType';
  import Db from '../database/mysql';

  const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post Schema',
    fields: () => {
      return {
        id: {
          type: GraphQLInt,
          resolve: post => post.id
        },
        title: {
          type: GraphQLString,
          resolve: post => post.title
        },
        content: {
          type: GraphQLString,
          resolve: post => post.content
        },
        user: {
          type: UserType,
          resolve: post => post.getUser()
        }
      };
    }
  });

  export default PostType;

create query.js
  touch schemas/query.js

add to query.js
  import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLString
  } from 'graphql';

  // internal
  import UserType from './userType';
  import PostType from './postType';
  import Db from '../database/mysql';

  const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: () => {
      return {
        user: {
          type: new GraphQLList(UserType),
          args: {
            id: {
              type: GraphQLInt
            }
          },
          resolve: (root, args) => Db.models.user.findAll({where: args})
        },
        post: {
          type: new GraphQLList(PostType),
          args: {
            id: {
              type: GraphQLInt
            }
          },
          resolve: (root, args) => Db.models.post.findAll({where: args})
        }
      };
    }
  });

  export default Query;

create index.js
  touch schemas/index.js

add to index.js
  import {GraphQLSchema} from 'graphql';
  import query from './query'

  const Schema = new GraphQLSchema({
    query
  });

  export default Schema;
```

## Update Server.js

update server.js to include schema and graphiql ui.

```
Install package
  npm install --save graphiql express-graphql

add to server.js
  import GraphHTTP from 'express-graphql';
  import schema from './schemas/index';

update APP Route

  from:
  APP.get(/, (req, res) => {
    res.send('Hello!');
  });

  to:
  APP.use('/graphql', GraphHTTP({
    schema
    graphiql: true
  }));

Run It
  npm start
  http://localhost:3000/graphql
```

## Questions
