var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var UserModel = require('../models/User');

var userType = new GraphQLObjectType({
  name: 'user',
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      },
      birthDate: {
        type: GraphQLInt
      },
      updatedDate: {
        type: GraphQLDate
      }
    };
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function() {
    return {
      users: {
        type: new GraphQLList(userType),
        resolve: function() {
          const users = UserModel.find().exec();
          if (!users) {
            throw new Error('Error');
          }
          return users;
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const userDetails = UserModel.findById(params.id).exec();
          if (!userDetails) {
            throw new Error('Error');
          }
          return userDetails;
        }
      }
    };
  }
});

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function() {
    return {
      addUser: {
        type: userType,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function(root, params) {
          const bookModel = new BookModel(params);
          const newBook = bookModel.save();
          if (!newBook) {
            throw new Error('Error');
          }
          return newBook;
        }
      },
      updateBook: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return UserModel.findByIdAndUpdate(
            params.id,
            {
              firstName: params.firstName,
              lastName: params.lastName,
              email: params.email,
              description: params.description,
              username: params.username,
              publisher: params.publisher,
              updated_date: new Date()
            },
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      removeBook: {
        type: userType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remBook = BookModel.findByIdAndRemove(params.id).exec();
          if (!remBook) {
            throw new Error('Error');
          }
          return remBook;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
