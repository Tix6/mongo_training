const load = require('./load'); // eslint-disable-line
const extract = require('./extract');
const { computeUserTraining, computeCoursesUsage } = require('./compute');

// load();

extract()
  .then(e => console.log('extracted: ', e, '\n')); // eslint-disable-line

computeUserTraining()
  .then(u => console.log('userTraining: ', u, '\n')); // eslint-disable-line

computeCoursesUsage()
  .then(c => console.log('coursesUsage: ', c, '\n')); // eslint-disable-line
