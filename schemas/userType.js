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
