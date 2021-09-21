const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connection succesfull!!!");
  })
  .catch((err) => {
    console.log(err);
    console.log("connection failed");
  });

const app = require("./app");

const port = process.env.PORT || 3502;

const server = app.listen(port, () => {
  console.log(`This port number is ${port}`);
});
