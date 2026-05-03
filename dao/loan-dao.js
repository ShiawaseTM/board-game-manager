const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const loanFolderPath = path.join(__dirname, "storage", "loanList");

function get(loanId) {
    try {
        const filePath = path.join(loanFolderPath, `${loanId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadLoan", message: error.message };
    }
}

function create(loan) {
    try {
        loan.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(loanFolderPath, `${loan.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(loan), "utf8");
        return loan;
    } catch (error) {
        throw { code: "failedToCreateLoan", message: error.message };
    }
}

function update(loan) {
    try {
        const currentLoan = get(loan.id);
        if (!currentLoan) return null;
        const newLoan = { ...currentLoan, ...loan };
        const filePath = path.join(loanFolderPath, `${loan.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newLoan), "utf8");
        return newLoan;
    } catch (error) {
        throw { code: "failedToUpdateLoan", message: error.message };
    }
}

function remove(loanId) {
    try {
        const filePath = path.join(loanFolderPath, `${loanId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") return {};
        throw { code: "failedToRemoveLoan", message: error.message };
    }
}

function list(filter = {}) {
    try {
        const files = fs.readdirSync(loanFolderPath);
        let loanList = files.map((file) => {
            const fileData = fs.readFileSync(path.join(loanFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });

        const filterDate = filter.date ? new Date(filter.date).getMonth() : new Date().getMonth();
        loanList = loanList.filter((item) => new Date(item.date).getMonth() === filterDate);
        loanList.sort((a, b) => new Date(a.date) - new Date(b.date));
        return loanList;
    } catch (error) {
        throw { code: "failedToListLoans", message: error.message };
    }
}

function listByBoardGameId(boardGameId) {
    return list().filter((item) => item.boardGameId === boardGameId);
}

module.exports = { get, create, update, remove, list, listByBoardGameId };