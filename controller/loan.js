const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/loan/getAbl");
const ListAbl = require("../abl/loan/listAbl");
const CreateAbl = require("../abl/loan/createAbl");
const UpdateAbl = require("../abl/loan/updateAbl");
const DeleteAbl = require("../abl/loan/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;