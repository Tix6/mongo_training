const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/mongo_training';

const connect = () => MongoClient.connect(url).then(db => {
  console.log('connected'); // eslint-disable-line
  return db;
});

module.exports = connect;
