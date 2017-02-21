const R = require('ramda');
const extract = require('./extract');

const computeUserTraining = () => {

  return extract().then(({ people, sessions }) => {
    const coursesByUserId = R.reduce((acc, cur) => {
      const key = cur.user.externalId;
      acc[key] = R.concat(acc[key] || [], [cur.course]);
      return acc;
    }, {});

    const trainingByUser = R.map(([userId, coursesList]) => {
      const { firstName, lastName } = people[userId];
      const skills = R.compose(R.sortBy(R.prop('skill')), R.flatten, R.pluck('skillPoints'))(coursesList);
      const total = R.reduce((a, b) => a + b.points, 0)(skills);
      return { firstName, lastName, points: { total, details: skills } };
    });

    return R.compose(R.sortBy(R.prop('lastName')), trainingByUser, R.toPairs, coursesByUserId)(sessions);
  });
};

const computeCoursesUsage = () => {

  return extract().then(({ courses, sessions }) => {
    const coursesCount = R.reduce((acc, cur) => {
      const key = cur.course.externalId;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const coursesUsage = R.mapObjIndexed((course, key) => {
      const { name, skillPoints } = courses[key];
      const points = R.reduce((a, b) => a + b.points, 0)(skillPoints);
      return { name, points };
    });

    return R.compose(R.sortBy(R.prop('points')), R.values, coursesUsage, coursesCount)(sessions);
  });
};

module.exports = { computeUserTraining, computeCoursesUsage };
