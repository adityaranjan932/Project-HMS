// const axiosBase = require("axios");
// const cheerio = require("cheerio");
// const { wrapper } = require("axios-cookiejar-support");
// const tough = require("tough-cookie");
// const readline = require("readline");

// // Axios setup with cookies
// const cookieJar = new tough.CookieJar();
// const axios = wrapper(
//   axiosBase.create({
//     jar: cookieJar,
//     withCredentials: true,
//   })
// );

// // Function to fetch odd semester result
// async function fetchOddResult(data) {
//   const url = "https://result.lkouniv.ac.in/Results/LU_OddResult2025";
//   const payload = {
//     CourseId: data.CourseId,
//     Semester: data.Semester,
//     ExamType: data.ExamType,
//     SubjectId: data.SubjectId,
//     Rollno: data.Rollno,
//     Dob1: data.Dob1,
//     hdntype: "Get",
//   };
//   const headers = { "User-Agent": "Mozilla/5.0" };
//   try {
//     const response = await axios.post(url, new URLSearchParams(payload), { headers });
//     if (response.status === 200) {
//       const $ = cheerio.load(response.data);
//       const resultSection = $("#prodiv");
//       if (resultSection.length) {
//         return extractStudentInfo($, resultSection);
//       }
//     }
//     return { status: "error", message: "Result not found or invalid input." };
//   } catch (e) {
//     return { status: "error", message: `Error fetching odd result: ${e.message}` };
//   }
// }

// // Function to fetch even semester result
// async function fetchEvenResult(data) {
//   const url = "https://result.lkouniv.ac.in/Results/EvenResult2024";
//   const payload = {
//     CourseId: data.CourseId,
//     Semester: data.Semester,
//     ExamType: data.ExamType,
//     SubjectId: data.SubjectId,
//     Rollno: data.Rollno,
//     Dob: data.Dob1,
//     hdntype: "Get",
//   };
//   const headers = { "User-Agent": "Mozilla/5.0" };
//   try {
//     const response = await axios.post(url, new URLSearchParams(payload), { headers });
//     if (response.status === 200) {
//       const $ = cheerio.load(response.data);
//       const resultSection = $("#prodiv");
//       if (resultSection.length) {
//         return extractStudentInfo($, resultSection);
//       }
//     }
//     return { status: "error", message: "Result not found or invalid input." };
//   } catch (e) {
//     return { status: "error", message: `Error fetching even result: ${e.message}` };
//   }
// }

// // Function to extract student information from HTML
// function extractStudentInfo($, resultSection) {
//   const studentInfo = { status: "success" };
//   const studentTable = resultSection.find("table").first();
//   studentTable.find("tr").each((_, row) => {
//     const cells = $(row).find("td");
//     if (cells.length >= 2) {
//       const key = cells.eq(0).text().trim();
//       const value = cells.eq(1).text().trim();
//       if (key.includes("Name of Student")) studentInfo.Name = value;
//       if (key.includes("Father's Name")) studentInfo.Father_Name = value;
//       if (key.includes("Roll No.")) studentInfo.Roll_No = value;
//       if(key.includes("Name of Examination")) studentInfo.Course = value.slice(0,42);
//       if(key.includes("Mother's Name")) studentInfo.Mother_Name = value;
//     }
//   });

//   const subjectTable = resultSection.find("table").eq(1);
//   const summaryRow = subjectTable.find("tr").last();
//   studentInfo.SGPA = summaryRow.find("td").eq(1).text().replace("SGPA:", "").trim();
//   studentInfo.Total_Marks = summaryRow.find("td").eq(2).text().replace("Total Marks :", "").trim();

//   // Calculate Percentage (assuming Total_Marks is in "obtained/max" format, e.g., "450/600")
//   const marks = studentInfo.Total_Marks.split("/");
//   if (marks.length === 2) {
//     const obtained = parseFloat(marks[0]);
//     const max = parseFloat(marks[1]);
//     studentInfo.Percentage = ((obtained / max) * 100).toFixed(2);
//   } else {
//     studentInfo.Percentage = "N/A";
//   }

//   const summaryText = resultSection.find("center").text().trim().split("\n");
//   studentInfo.Result = summaryText[0].replace("RESULT :", "").trim();
//   studentInfo.CGPA = summaryText[1].replace("CGPA :", "").trim();

//   return studentInfo;
// }

// // Function to check hostel eligibility
// function checkHostelEligibility(combinedResults) {
//   const oddResult = combinedResults.previous_odd_result;
//   const evenResult = combinedResults.previous_even_result;

//   if (oddResult.status !== "success" || evenResult.status !== "success") {
//     return {
//       eligible: false,
//       message: "Cannot determine eligibility due to missing or invalid semester results.",
//     };
//   }

//   const oddPercentage = parseFloat(oddResult.Percentage);
//   const evenPercentage = parseFloat(evenResult.Percentage);

//   if (isNaN(oddPercentage) || isNaN(evenPercentage)) {
//     return {
//       eligible: false,
//       message: "Cannot determine eligibility due to invalid percentage data.",
//     };
//   }

//   const eligible = oddPercentage >= 60 && evenPercentage >= 60;
//   return {
//     eligible,
//     message: eligible
//       ? "Eligible for hostel based on academic performance."
//       : "Not eligible for hostel. Minimum 60% required in both semesters.",
//   };
// }

// // Function to fetch combined results
// async function fetchCombinedResults(data) {
//   const currentSemester = parseInt(data.Semester);
//   if (isNaN(currentSemester) || currentSemester < 1 || currentSemester > 8) {
//     return { status: "error", message: "Invalid semester input. Must be between 1 and 8." };
//   }

//   const combinedResults = {
//     current_semester: currentSemester,
//     current_result: currentSemester % 2 === 0 ? await fetchEvenResult(data) : await fetchOddResult(data),
//   };

//   if (currentSemester > 2) {
//     const oddData = { ...data, Semester: (currentSemester - 2).toString() }; // Previous odd (e.g., Sem 3)
//     const evenData = { ...data, Semester: (currentSemester - 1).toString() }; // Previous even (e.g., Sem 4)

//     combinedResults.previous_odd_result = await fetchOddResult(oddData);
//     combinedResults.previous_even_result = await fetchEvenResult(evenData);

//     // combinedResults.Previous_Odd_Semester = currentSemester - 2; // Label for Sem 3
//     combinedResults.Previous_Even_Semester = currentSemester - 1; // Label for Sem 4

//     combinedResults.hostel_eligibility = checkHostelEligibility(combinedResults);
//   } else {
//     combinedResults.hostel_eligibility = {
//       eligible: false,
//       message: "Eligibility check requires at least semester 3 results.",
//     };
//   }

//   return combinedResults;
// }

// // CLI testing
// if (require.main === module) {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   rl.question("Enter CourseId: ", (CourseId) => {
//     rl.question("Enter Semester: ", (Semester) => {
//       rl.question("Enter ExamType (Regular/Back): ", (ExamType) => {
//         rl.question("Enter SubjectId: ", (SubjectId) => {
//           rl.question("Enter Rollno: ", (Rollno) => {
//             rl.question("Enter DOB (dd/mm/yyyy): ", async (Dob) => {
//               const userData = {
//                 CourseId,
//                 Semester,
//                 ExamType,
//                 SubjectId,
//                 Rollno,
//                 Dob,
//                 Dob1: Dob,
//               };

//               console.log("Fetching combined results with user data:", userData);
//               const result = await fetchCombinedResults(userData);
//               console.log(JSON.stringify(result, null, 2));
//               rl.close();
//             });
//           });
//         });
//       });
//     });
//   });
// }

// module.exports = {
//   fetchOddResult,
//   fetchEvenResult,
//   fetchCombinedResults,
//   checkHostelEligibility,
// };



const axiosBase = require("axios");
const cheerio = require("cheerio");
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");
const readline = require("readline");

// Axios setup with cookies
const cookieJar = new tough.CookieJar();
const axios = wrapper(
  axiosBase.create({
    jar: cookieJar,
    withCredentials: true,
  })
);

// Function to fetch odd semester result
async function fetchOddResult(data) {
  const url = "https://result.lkouniv.ac.in/Results/LU_OddResult2025";
  const payload = {
    CourseId: data.CourseId,
    Semester: data.Semester,
    ExamType: data.ExamType,
    SubjectId: data.SubjectId,
    Rollno: data.Rollno,
    Dob1: data.Dob1,
    hdntype: "Get",
  };
  const headers = { "User-Agent": "Mozilla/5.0" };
  try {
    const response = await axios.post(url, new URLSearchParams(payload), { headers });
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const resultSection = $("#prodiv");
      if (resultSection.length) {
        return extractStudentInfo($, resultSection);
      }
    }
    return { status: "error", message: "Result not found or invalid input." };
  } catch (e) {
    return { status: "error", message: `Error fetching odd result: ${e.message}` };
  }
}

// Function to fetch even semester result
async function fetchEvenResult(data) {
  const url = "https://result.lkouniv.ac.in/Results/EvenResult2024";
  const payload = {
    CourseId: data.CourseId,
    Semester: data.Semester,
    ExamType: data.ExamType,
    SubjectId: data.SubjectId,
    Rollno: data.Rollno,
    Dob: data.Dob1,
    hdntype: "Get",
  };
  const headers = { "User-Agent": "Mozilla/5.0" };
  try {
    const response = await axios.post(url, new URLSearchParams(payload), { headers });
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const resultSection = $("#prodiv");
      if (resultSection.length) {
        return extractStudentInfo($, resultSection);
      }
    }
    return { status: "error", message: "Result not found or invalid input." };
  } catch (e) {
    return { status: "error", message: `Error fetching even result: ${e.message}` };
  }
}

// Function to extract student information from HTML
function extractStudentInfo($, resultSection) {
  const studentInfo = { status: "success" };
  const studentTable = resultSection.find("table").first();
  studentTable.find("tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 2) {
      const key = cells.eq(0).text().trim();
      const value = cells.eq(1).text().trim();
      if (key.includes("Name of Student")) studentInfo.Name = value;
      if (key.includes("Father's Name")) studentInfo.Father_Name = value;
      if (key.includes("Roll No.")) studentInfo.Roll_No = value;
      if (key.includes("Name of Examination")) studentInfo.Course = value.slice(0, 42);
      if (key.includes("Mother's Name")) studentInfo.Mother_Name = value;
    }
  });

  const subjectTable = resultSection.find("table").eq(1);
  const summaryRow = subjectTable.find("tr").last();
  studentInfo.SGPA = summaryRow.find("td").eq(1).text().replace("SGPA:", "").trim();
  studentInfo.Total_Marks = summaryRow.find("td").eq(2).text().replace("Total Marks :", "").trim();

  // Calculate Percentage (assuming Total_Marks is in "obtained/max" format, e.g., "450/600")
  const marks = studentInfo.Total_Marks.split("/");
  if (marks.length === 2) {
    const obtained = parseFloat(marks[0]);
    const max = parseFloat(marks[1]);
    studentInfo.Percentage = ((obtained / max) * 100).toFixed(2);
  } else {
    studentInfo.Percentage = "N/A";
  }

  const summaryText = resultSection.find("center").text().trim().split("\n");
  studentInfo.Result = summaryText[0].replace("RESULT :", "").trim();
  studentInfo.CGPA = summaryText[1].replace("CGPA :", "").trim();

  return studentInfo;
}

// Function to check hostel eligibility for two semesters
function checkHostelEligibility(result1, result2) {
  if (result1.status !== "success" || result2.status !== "success") {
    return {
      eligible: false,
      message: "Cannot determine eligibility due to missing or invalid semester results.",
    };
  }

  const perc1 = parseFloat(result1.Percentage);
  const perc2 = parseFloat(result2.Percentage);

  if (isNaN(perc1) || isNaN(perc2)) {
    return {
      eligible: false,
      message: "Cannot determine eligibility due to invalid percentage data.",
    };
  }

  const eligible = perc1 >= 60 && perc2 >= 60;
  return {
    eligible,
    message: eligible
      ? "Eligible for hostel based on academic performance."
      : "Not eligible for hostel. Minimum 60% required in both semesters.",
  };
}

// Function to fetch combined results for 3*2-1 and 3*2-2 semesters, including student info
async function fetchCombinedResults(data) {
  const year = data.year ? parseInt(data.year) : 3;
  if (isNaN(year) || year < 1 || year > 4) {
    return { status: "error", message: "Invalid year input. Must be between 1 and 4." };
  }

  const semOdd = (year * 2) - 1; // e.g., 5 for year 3
  const semEven = (year * 2) - 2; // e.g., 4 for year 3

  const oddData = { ...data, Semester: semOdd.toString() };
  const evenData = { ...data, Semester: semEven.toString() };

  const oddResult = await fetchOddResult(oddData);
  const evenResult = await fetchEvenResult(evenData);

  // Extract student info from the odd semester result if available, else even
  let studentInfo = {};
  if (oddResult.status === "success") {
    studentInfo = {
      Roll_No: oddResult.Roll_No,
      Name: oddResult.Name,
      Father_Name: oddResult.Father_Name,
      Mother_Name: oddResult.Mother_Name,
      Course: oddResult.Course,
    };
  } else if (evenResult.status === "success") {
    studentInfo = {
      Roll_No: evenResult.Roll_No,
      Name: evenResult.Name,
      Father_Name: evenResult.Father_Name,
      Mother_Name: evenResult.Mother_Name,
      Course: evenResult.Course,
    };
  }

  const combinedResults = {
    ...studentInfo,
    year: year,
    odd_semester: semOdd,
    even_semester: semEven,
    odd_semester_result: oddResult,
    even_semester_result: evenResult,
    hostel_eligibility: checkHostelEligibility(oddResult, evenResult),
  };

  return combinedResults;
}

// CLI testing
if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter CourseId: ", (CourseId) => {
    rl.question("Enter Year (1-4): ", (Year) => {
      rl.question("Enter ExamType (Regular/Back): ", (ExamType) => {
        rl.question("Enter SubjectId: ", (SubjectId) => {
          rl.question("Enter Rollno: ", (Rollno) => {
            rl.question("Enter DOB (dd/mm/yyyy): ", async (Dob) => {
              const userData = {
                CourseId,
                year: Year,
                ExamType,
                SubjectId,
                Rollno,
                Dob,
                Dob1: Dob,
              };

              console.log("Fetching combined results with user data:", userData);
              const result = await fetchCombinedResults(userData);
              console.log(JSON.stringify(result, null, 2));
              rl.close();
            });
          });
        });
      });
    });
  });
}

module.exports = {
  fetchOddResult,
  fetchEvenResult,
  fetchCombinedResults,
  checkHostelEligibility,
};