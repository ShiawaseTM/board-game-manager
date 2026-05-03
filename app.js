const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const boardGameController = require("./controller/boardGame");
const loanController = require("./controller/loan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/game", boardGameController);
app.use("/loan", loanController);

app.listen(port, () => {
    console.log(` http://localhost:${port} `);
});