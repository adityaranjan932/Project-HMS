const fetchResult = require("./utils/fetchResult");

(async () => {
  const result = await fetchResult({
    CourseId: "13",
    Semester: "5",
    ExamType: "Regular",
    SubjectId: "13",
    Rollno: "2210013135033",
    Dob1: "03/01/2004"
  });

  console.log("Fetched Result:", result);
})();
