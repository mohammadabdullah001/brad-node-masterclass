const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const colors = require("colors");
const path = require("path");
colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
  success: ["green", "underline", "bold"],
});

const morgan = require("morgan");
dotenv.config({ path: "config/config.env" });
connectDB();
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// file upload
app.use(fileUpload());

// static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    ` server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.success
  );
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`.error);
  server.close(() => process.exit(1));
});
