const express = require("express");
const env = require("dotenv");
const path = require("path");
const app = express();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
env.config();

app.use(express.json());
app.use(
    express.urlencoded({
        extends: true,
    })
);
app.use(express.static(path.join(__dirname, "/build")));

app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "/build/index.html"));
});

const users = [];
const upsert = (array, item) => {
    const i = array.findIndex((_item) => (_item.email = item.email));
    if (i > -1) {
        array[i] = item;
    } else {
        array.push(item);
    }
};
app.post("/api/google-login", async (req, res, next) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    upsert(users, { name, email, picture });

    res.status(201).json({
        name,
        email,
        picture,
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is listening on port: ", 5000);
});
