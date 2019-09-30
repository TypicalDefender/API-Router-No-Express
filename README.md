# API-Router-No-Express
No NPM module used

#use this command to get your keys for creating https server!!





openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem


#student details
export async function getListResults(args) {
  const query = {};

  if (args.testId) {
    query.testId = args.testId;
  }
  if (args.levelCode) {
    query.lastLevelCode = args.levelCode;
  }
  // academic year added
  if (args.academicYear) {
    query.academicYear = args.academicYear;
  }

  const projection = {
    _id: 0,
    studentId: 1,
    studentName: 1,
    results: 1,
  };
  const projection2 = {
    _id: 0,
    data: 1,
  };
  const array = [];
  Grade.find(
    { parent: 'CBSE', 'data.type': 'subject' },
    projection2,
  ).then(docs => {
    for (let i = 0; i < docs.length; i += 1) {
      const gradeHandler = {};
      gradeHandler.minMarks = parseInt(docs[i].data.minMarks, 10);
      gradeHandler.maxMarks = parseInt(docs[i].data.maxMarks, 10);
      gradeHandler.patternName = docs[i].data.patternName;
      array.push(gradeHandler);
    }
  });
  return MasterResult.find(query, projection)
    .then(docs => {
      const result = [];
      for (let i = 0; i < docs.length; i += 1) {
        const handlers = {};
        handlers.studentId = docs[i].studentId;
        handlers.studentName = docs[i].studentName;
        handlers.subjects = {};
        handlers.subjectName = [];
        const subName = {};

        const key = Object.keys(docs[i].results.scholastic);
        const values = Object.values(docs[i].results.scholastic);
        let totalMarks = 0;
        for (let j = 0; j < key.length; j += 1) {
          const val = parseInt(values[j].totalObtainedMarks, 10);
          if (key[j] === 'II Language') {
            subName.IILanguage = val;
          } else if (key[j] === 'Environmental Studies') {
            subName.EnvironmentalStudies = val;
          } else {
            subName[key[j]] = val;
          }
          handlers.subjects[key[j]] = val;
          totalMarks += val;
        }
        handlers.subjectName.push(subName);
        handlers.totalmarks = totalMarks;
        const percentage = totalMarks / key.length;
        for (let k = 0; k < array.length; k += 1) {
          if (
            percentage >= array[k].minMarks &&
            percentage <= array[k].maxMarks
          ) {
            handlers.Grade = array[k].patternName;
            break;
          }
          result.push(handlers);
        }
      }
      return result;
    })
    .catch(err => {
      console.error('db err is', err);
      throw { statusMessage: err.message };
    });
}
