const loanDao = require("../../dao/loan-dao.js");
const boardGameDao = require("../../dao/boardGame-dao.js");

async function ListAbl(req, res) {
    try {
        const loanList = loanDao.list();
        const boardGameMap = boardGameDao.getBoardGameMap();
        res.json({
            itemList: loanList,
            boardGameMap: boardGameMap
        });
    } catch (e) {
        res.status(500).json({ error: "Ошибка при чтении списка", message: e.message });
    }
}

module.exports = ListAbl;