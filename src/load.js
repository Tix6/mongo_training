const R = require('ramda');
const connect = require('./connect');
const { people, courses, trainingSessions } = require('../data');

const load = () => {
  const mapExternalId = (data) => R.map(item => R.merge(R.omit('id')(item), { externalId: item.id }))(data);
  const resultToData = result => result.ops;
  const listToIdTable = R.reduce((acc, item) => R.merge(acc, {[item.externalId]: item._id}), {});

  connect().then(db => {
    const peoplePromise = db.collection('people').insertMany(mapExternalId(people)).then(resultToData);
    const coursesPromise = db.collection('courses').insertMany(mapExternalId(courses)).then(resultToData);

    Promise.all([peoplePromise, coursesPromise])
      .then(([peopleList, coursesList]) => [listToIdTable(peopleList), listToIdTable(coursesList)])
      .then(([peopleIdTable, coursesIdTable]) => {
        const sessionsList = R.map(
          ({ userId, courseId }) => ({
            userId: peopleIdTable[userId],
            courseId: coursesIdTable[courseId]
          }))(trainingSessions);
        return db.collection('sessions').insertMany(sessionsList).then(() => db.close());
      });
  })
  .catch(console.error); // eslint-disable-line
};

module.exports = load;
