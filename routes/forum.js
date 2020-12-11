const express = require("express"),
  router = express.Router();


//forum home page
//====================================================
router.get("/forum", (req, res) => {
  res.render("forum/index");
});

//surf reports 
router.get("/forum/surfReports", (req, res) => {
  res.render("forum/surfReport")
})

module.exports = router;
