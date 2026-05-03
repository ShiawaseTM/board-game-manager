const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const loanDao = require("../../dao/loan-dao.js");
const boardGameDao = require("../../dao/boardGame-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        borrowerName: { type: "string", maxLength: 150 },
        boardGameId: { type: "string" },
        date: { type: "string", format: "date" },
    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let loan = req.body;
        const valid = ajv.validate(schema, loan);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }

        if (loan.date && new Date(loan.date) > new Date()) {
            return res.status(400).json({ code: "invalidDate", message: "Date must be current day or a day in the past" });
        }

        const updatedLoan = loanDao.update(loan);
        if (!updatedLoan) {
            return res.status(404).json({ code: "loanNotFound", message: `Loan ${loan.id} not found` });
        }

        if (updatedLoan.boardGameId) {
            const game = boardGameDao.get(updatedLoan.boardGameId);
            if (!game) {
                return res.status(400).json({ code: "boardGameDoesNotExist", message: `Board game does not exist` });
            }
            updatedLoan.boardGame = game;
        }

        res.json(updatedLoan);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = UpdateAbl;