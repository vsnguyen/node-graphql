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
