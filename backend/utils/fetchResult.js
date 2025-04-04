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

// Fetch result function
async function fetchResult(data) {
  const url = "https://result.lkouniv.ac.in/Results/LU_OddResult2025";
  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const payload = {
    CourseId: data.CourseId,
    Semester: data.Semester,
    ExamType: data.ExamType,
    SubjectId: data.SubjectId,
    Rollno: data.Rollno,
    Dob1: data.Dob1,
    hdntype: "Get",
  };

  try {
    await axios.get(url, { headers });
    const response = await axios.post(url, new URLSearchParams(payload), {
      headers,
    });

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const resultSection = $("#prodiv");

      if (resultSection.length > 0) {
        const resultArray = [];
        const studentTable = resultSection.find("table").first();
        studentTable.find("tr").each((i, row) => {
          const cells = $(row).find("td");
          const key = cells.eq(0).text().trim();
          let value = cells.eq(1).text().trim();
          if (
            [
              "Roll No.",
              "Name of Student",
              "Father's Name",
              "Mother's Name",
              "Name of Examination",
            ].includes(key)
          ) {
            resultArray.push({ key, value });
          }
          if (i === 0) {
            resultArray.push({
              key: "Enrollment No.",
              value: cells.eq(2).text().replace("Enrollment No.:", "").trim(),
            });
          }
        });

        const subjectTable = resultSection.find("table").eq(1);
        const summaryRow = subjectTable.find("tr").last();
        resultArray.push({
          key: "SGPA",
          value: summaryRow.find("td").eq(1).text().replace("SGPA:", "").trim(),
        });
        resultArray.push({
          key: "Total Marks",
          value: summaryRow
            .find("td")
            .eq(2)
            .text()
            .replace("Total Marks :", "")
            .trim(),
        });

        const summaryText = resultSection.find("center").text().trim().split("\n");
        resultArray.push({
          key: "Result",
          value: summaryText[0].replace("RESULT :", "").trim(),
        });
        resultArray.push({
          key: "Promotion",
          value: summaryText[2].replace("PROMOTION :", "").trim(),
        });

        return {
          status: "success",
          result: resultArray,
        };
      } else {
        return { status: "error", message: "Result not found. Check input data." };
      }
    } else {
      return { status: "error", message: `HTTP Error ${response.status}` };
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
}

// Only run this part if the file is executed directly (for CLI testing)
if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter CourseId: ", (CourseId) => {
    rl.question("Enter Semester: ", (Semester) => {
      rl.question("Enter ExamType (Regular/Back): ", (ExamType) => {
        rl.question("Enter SubjectId: ", (SubjectId) => {
          rl.question("Enter Rollno: ", (Rollno) => {
            rl.question("Enter DOB (dd/mm/yyyy): ", async (Dob1) => {
              const userData = {
                CourseId,
                Semester,
                ExamType,
                SubjectId,
                Rollno,
                Dob1,
              };

              const result = await fetchResult(userData);
              console.log(JSON.stringify(result, null, 2));
              rl.close();
            });
          });
        });
      });
    });
  });
}

// Export for use in controllers
module.exports = { fetchResult };
