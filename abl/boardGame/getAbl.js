const Ajv = require("ajv");
const ajv = new Ajv();
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

        const game = boardGameDao.get(reqParams.id);
        if (!game) {
            return res.status(404).json({ code: "boardGameNotFound", message: `Board game with id ${reqParams.id} not found` });
        }
        res.json(game);
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = GetAbl;