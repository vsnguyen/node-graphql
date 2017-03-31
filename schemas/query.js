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
