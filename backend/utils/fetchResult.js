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

// Combined fetch result function
async function fetchResult(data, isEvenSemester = false) {
  const url = isEvenSemester
    ? "https://result.lkouniv.ac.in/Results/EvenResult2024"
    : "https://result.lkouniv.ac.in/Results/LU_OddResult";
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
    Dob: isEvenSemester ? data.Dob : undefined, // Use Dob for even semester
    Dob1: isEvenSemester ? undefined : data.Dob1, // Use Dob1 for odd semester
    hdntype: isEvenSemester ? "" : "Get",
  };

  try {
    console.log(`Fetching ${isEvenSemester ? "even" : "odd"} semester results...`);
    console.log("Payload being sent:", payload);

    // Validate payload for odd semester
    if (!isEvenSemester && (!payload.Dob1 || payload.Dob1 === "undefined")) {
      console.error("DOB1 is missing or undefined for odd semester request.");
      return {
        status: "error",
        message: "DOB1 is required for odd semester result fetching.",
      };
    }

    // Validate payload for even semester
    if (isEvenSemester && (!payload.Dob || payload.Dob === "undefined")) {
      console.error("DOB is missing or undefined for even semester request.");
      return {
        status: "error",
        message: "DOB is required for even semester result fetching.",
      };
    }

    console.log("Sending GET request to fetch cookies...");
    await axios.get(url, { headers });
    console.log("Cookies fetched successfully.");

    console.log("Sending POST request with payload:", payload);
    const response = await axios.post(url, new URLSearchParams(payload), {
      headers,
    });

    if (response.status === 200) {
      console.log("Response received successfully.");
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

        // Check eligibility
        const result = resultArray.find(item => item.key === "Result")?.value;
        const totalMarksStr = resultArray.find(item => item.key === "Total Marks")?.value;

        if (!result || !totalMarksStr) {
          return {
            status: "error",
            message: "Incomplete result data. Cannot verify eligibility.",
          };
        }

        const [obtained, total] = totalMarksStr.split("/").map(s => parseFloat(s.trim()));
        const percentage = (obtained / total) * 100;

        if (result !== "PASSED" || percentage < 50) {
          return {
            status: "error",
            message: "You are not eligible for hostel registration (must be PASSED and ≥ 50% marks).",
            data: {
              result,
              percentage: percentage.toFixed(2),
            }
          };
        }

        return {
          status: "success",
          message: "You are eligible for hostel registration.",
          data: {
            result,
            percentage: percentage.toFixed(2),
            details: resultArray
          }
        };
      } else {
        return {
          status: "error",
          message: "Result not found. Please verify the input details.",
        };
      }
    } else {
      console.error(`Unexpected HTTP status: ${response.status}`);
      return {
        status: "error",
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Server responded with status ${error.response.status}:`,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    return {
      status: "error",
      message: "Failed to fetch result. Please try again later.",
    };
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
            rl.question("Enter DOB (dd/mm/yyyy): ", async (Dob) => {
              rl.question("Is this for an even semester? (yes/no): ", async (isEven) => {
                const isEvenSemester = isEven.toLowerCase() === "yes";
                const userData = {
                  CourseId,
                  Semester,
                  ExamType,
                  SubjectId,
                  Rollno,
                  Dob: isEvenSemester ? Dob : undefined, // Assign Dob for even semester
                  Dob1: isEvenSemester ? undefined : Dob, // Assign Dob1 for odd semester
                };

                console.log("Fetching result with user data:", userData);
                const result = await fetchResult(userData, isEvenSemester);
                console.log(JSON.stringify(result, null, 2));
                rl.close();
              });
            });
          });
        });
      });
    });
  });
}

// Export for use in controllers
module.exports = fetchResult;
