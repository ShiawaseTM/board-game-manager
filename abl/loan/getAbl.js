const Ajv = require("ajv");
const ajv = new Ajv();
const loanDao = require("../../dao/loan-dao.js");
const boardGameDao = require("../../dao/boardGame-dao.js");

const schema = {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
    additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        const reqParams = req.query?.id ? req.query : req.body;
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }

        const loan = loanDao.get(reqParams.id);
        if (!loan) {
            return res.status(404).json({ code: "loanNotFound", message: `Loan ${reqParams.id} not found` });
        }

        const game = boardGameDao.get(loan.boardGameId);
        loan.boardGame = game;
        res.json(loan);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = GetAbl;