const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const loanDao = require("../../dao/loan-dao.js");
const boardGameDao = require("../../dao/boardGame-dao.js");

const schema = {
    type: "object",
    properties: {
        borrowerName: { type: "string", maxLength: 150 },
        boardGameId: { type: "string" },
        date: { type: "string", format: "date" },
    },
    required: ["borrowerName", "boardGameId", "date"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let loan = req.body;
        const valid = ajv.validate(schema, loan);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }

        if (new Date(loan.date) > new Date()) {
            return res.status(400).json({ code: "invalidDate", message: "Date must be current day or a day in the past" });
        }

        const game = boardGameDao.get(loan.boardGameId);
        if (!game) {
            return res.status(400).json({ code: "boardGameDoesNotExist", message: `Board game with id ${loan.boardGameId} does not exist` });
        }

        loan = loanDao.create(loan);
        loan.boardGame = game;
        res.json(loan);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = CreateAbl;