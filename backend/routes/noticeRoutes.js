const express = require("express");
const router = express.Router();
const {
  sendNotice,
  getSentNotices,
  getReceivedNotices,
  markNoticeAsRead,
  getNoticeStats,
  getAllNotices
} = require("../controllers/noticeController");

const { auth, isStudent, isProvost } = require("../middleware/auth");

// Routes for Provosts
router.post("/send", auth, isProvost, sendNotice);
router.get("/sent", auth, isProvost, getSentNotices);
router.get("/stats", auth, isProvost, getNoticeStats);
router.get("/all", auth, isProvost, getAllNotices);

// Routes for Students
router.get("/received", auth, isStudent, getReceivedNotices);
router.patch("/:noticeId/read", auth, isStudent, markNoticeAsRead);

module.exports = router;
