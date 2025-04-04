// hashGenerator.js
const bcrypt = require("bcrypt");

const generateHash = async () => {
  const provostPassword = "provost123";
  const chiefPassword = "chief456";

  const provostHash = await bcrypt.hash(provostPassword, 10);
  const chiefHash = await bcrypt.hash(chiefPassword, 10);

  console.log("Provost Password Hash:", provostHash);
  console.log("Chief Provost Password Hash:", chiefHash);
};

generateHash();
