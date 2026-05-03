const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const boardGameFolderPath = path.join(__dirname, "storage", "boardGameList");

function get(boardGameId) {
    try {
        const filePath = path.join(boardGameFolderPath, `${boardGameId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadBoardGame", message: error.message };
    }
}

function create(boardGame) {
    try {
        const boardGameList = list();
        if (boardGameList.some((item) => item.title === boardGame.title)) {
            throw { code: "uniqueTitleAlreadyExists", message: "Board game with given title already exists" };
        }
        boardGame.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(boardGameFolderPath, `${boardGame.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(boardGame), "utf8");
        return boardGame;
    } catch (error) {
        throw { code: "failedToCreateBoardGame", message: error.message };
    }
}

function update(boardGame) {
    try {
        const currentBoardGame = get(boardGame.id);
        if (!currentBoardGame) return null;

        if (boardGame.title && boardGame.title !== currentBoardGame.title) {
            const boardGameList = list();
            if (boardGameList.some((item) => item.title === boardGame.title)) {
                throw { code: "uniqueTitleAlreadyExists", message: "Board game with given title already exists" };
            }
        }

        const newBoardGame = { ...currentBoardGame, ...boardGame };
        const filePath = path.join(boardGameFolderPath, `${boardGame.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newBoardGame), "utf8");
        return newBoardGame;
    } catch (error) {
        throw { code: "failedToUpdateBoardGame", message: error.message };
    }
}

function remove(boardGameId) {
    try {
        const filePath = path.join(boardGameFolderPath, `${boardGameId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") return {};
        throw { code: "failedToRemoveBoardGame", message: error.message };
    }
}

function list() {
    try {
        const files = fs.readdirSync(boardGameFolderPath);
        return files.map((file) => {
            const fileData = fs.readFileSync(path.join(boardGameFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });
    } catch (error) {
        throw { code: "failedToListBoardGames", message: error.message };
    }
}

function getBoardGameMap() {
    const boardGameMap = {};
    list().forEach((game) => { boardGameMap[game.id] = game; });
    return boardGameMap;
}

module.exports = { get, create, update, remove, list, getBoardGameMap };