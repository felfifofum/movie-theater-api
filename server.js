const express = require("express");
const { db } = require("./db");
const userRouter = require("./routes/user");
const showRouter = require(`./routes/shows`);
const logger = require(`./middleware/logger`)
const seed = require("./seed");

const app = express();
app.use(express.json());

//logger middleware-runs every time http request occurs-has to be nefore ofther 'use'
app.use(logger)


app.use(`/users`, userRouter);
app.use(`/shows`, showRouter);


const HOST = process.env["HOST"] || "localhost";
const PORT = process.env["PORT"] || 3000;

app.listen(PORT, async () => {
  await seed();
  console.log(`Listening on http://${HOST}:${PORT}`);
});
