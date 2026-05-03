const Ajv = require("ajv");
const ajv = new Ajv();
const boardGameDao = require("../../dao/boardGame-dao.js");
const loanDao = require("../../dao/loan-dao.js");

const schema = {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
    additionalProperties: false,
};

async function DeleteAbl(req, res) {
    try {
        const reqParams = req.body;
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }
        const loanList = loanDao.listByBoardGameId(reqParams.id);
        if (loanList.length) {
            return res.status(400).json({ code: "boardGameHasLoans", message: "Board game has related loans and cannot be deleted" });
        }

        boardGameDao.remove(reqParams.id);
        res.json({});
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = DeleteAbl;