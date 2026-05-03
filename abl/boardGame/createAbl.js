const Ajv = require("ajv");
const ajv = new Ajv();
const boardGameDao = require("../../dao/boardGame-dao.js");

const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        ownershipType: { type: "string" }
    },
    required: ["title", "ownershipType"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let game = req.body;
        const valid = ajv.validate(schema, game);
        if (!valid) {
            return res.status(400).json({ code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors });
        }

        game.status = "Available";
        game = boardGameDao.create(game);
        res.json(game);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = CreateAbl;