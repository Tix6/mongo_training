const R = require('ramda');
const connect = require('./connect');

const extract = () => {

  const listToObj = R.reduce((acc, item) => R.merge(acc, {[item.externalId]: item}), {});
  const listToIdTable = R.reduce((acc, item) => R.merge(acc, {[item._id]: item}), {});

  return connect()
    .then(db => {
      const peoplePromise = db.collection('people').find({}).toArray();
      const coursesPromise = db.collection('courses').find({}).toArray();
      const sessionsPromise = db.collection('sessions').find({}).toArray();

      const peopleObj = peoplePromise.then(listToObj);
      const coursesObj = coursesPromise.then(listToObj);

      const peopleIdTable = peoplePromise.then(listToIdTable);
      const coursesIdTable = coursesPromise.then(listToIdTable);

      const sessionsList = Promise.all([peopleIdTable, coursesIdTable])
        .then(([people, courses]) =>
          sessionsPromise.then(R.map(({userId, courseId}) => ({
            user: people[userId],
            course: courses[courseId]
          }))));

      return Promise.all([peopleObj, coursesObj, sessionsList])
        .then(([people, courses, sessions]) => {
          db.close();
          return { people, courses, sessions};
        });
    })
    .catch(console.error); // eslint-disable-line
};

module.exports = extract;
