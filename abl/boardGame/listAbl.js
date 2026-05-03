const boardGameDao = require("../../dao/boardGame-dao.js");

async function ListAbl(req, res) {
    try {
        const gameList = boardGameDao.list();
        res.json({ itemList: gameList });
    } catch (e) {
        res.status(500).json({ error: e.message || e });
    }
}

module.exports = ListAbl;