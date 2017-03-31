import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const Conn = new Sequelize(
  'graphql',
  'root',
  null,
  {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
  }
);

// TABLES
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
    allowNull: false
  }
});

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

// User Relations
User.hasMany(Post);

// Post Relations
Post.belongsTo(User);

// SEED Data
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

// SEED
Conn.sync({force: true})
  .then(() =>
    _.times(10, () =>
      userSeed()
        .then(user => postSeed(user))
    )
  );

export default Conn;
