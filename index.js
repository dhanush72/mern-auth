const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Failed to MongoDB", error));

app.use("/api", require("./routers/user"));
app.use("/api", require("./routers/customer"));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
