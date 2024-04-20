const express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  const data = {
    apiName: "API - SIGBIR",
    propietario: "DESOFIW",
  };
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json(data);
});

module.exports = router;
