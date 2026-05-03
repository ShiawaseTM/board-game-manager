const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/boardGame/getAbl");
const ListAbl = require("../abl/boardGame/listAbl");
const CreateAbl = require("../abl/boardGame/createAbl");
const UpdateAbl = require("../abl/boardGame/updateAbl");
const DeleteAbl = require("../abl/boardGame/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;