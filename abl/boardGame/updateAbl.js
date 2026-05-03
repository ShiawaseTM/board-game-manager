const Ajv = require("ajv");
const ajv = new Ajv();
const boardGameDao = require("../../dao/boardGame-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        ownershipType: { type: "string" },
        status: { type: "string" }
    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let game = req.body;
        const valid = ajv.validate(schema, game);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }

        const updatedGame = boardGameDao.update(game);
        if (!updatedGame) {
            return res.status(404).json({ code: "boardGameNotFound", message: `Board game with id ${game.id} not found` });
        }
        res.json(updatedGame);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = UpdateAbl;