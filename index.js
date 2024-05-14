const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const saltRounds = 10;
const cors = require("cors");
const user = require("./routes/user");
const employee = require("./routes/employee");
const vacation = require("./routes/vacation");
const salary = require("./routes/salary");
const career = require("./routes/career");
const cloudinary = require("./cloudinary");
const upload = require("./multer");
const path = require("path");
const app = express();

app.use(cors({ origin: ["https://ashoshari.github.io","http://localhost:5173"] }));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://ashoshari.github.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next();
});

require("dotenv").config();
const fs = require("fs");

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/upload", upload.array("files"), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "Images");

  if (req.method === "POST") {
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    res.status(200).json({
      message: "images uploaded successfully",
      data: urls,
    });
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://aasemshoshari:captain10majed@emp-dashboard.wer2fpu.mongodb.net/"
  )
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", (req, res) => {
  user.signUp(req, res, bcrypt, saltRounds);
});

app.post("/login", (req, res) => {
  user.logIn(req, res, bcrypt);
});

app.post("/add-employee", (req, res) => {
  employee.addEmployee(req, res);
});

app.get("/get-employees", (req, res) => {
  employee.getEmployees(req, res);
});

app.post("/edit-employee", (req, res) => {
  employee.editEmployee(req, res);
});

app.post("/delete-employee/:id", (req, res) => {
  employee.deleteEmployee(req, res);
});

app.post("/request-vacation", (req, res) => {
  vacation.requestVacation(req, res);
});

app.post("/approve-vacation/:id", (req, res) => {
  vacation.approveVacation(req, res);
});

app.post("/reject-vacation/:id", (req, res) => {
  vacation.rejectVacation(req, res);
});

app.get("/get-vacations", (req, res) => {
  vacation.getVacations(req, res);
});

app.post("/add-salary", (req, res) => {
  salary.addSalary(req, res);
});

app.get("/get-salaries", (req, res) => {
  salary.getSalaries(req, res);
});

app.post("/delete-salary/:id", (req, res) => {
  salary.deleteSalary(req, res);
});

app.post("/edit-salary", (req, res) => {
  salary.editSalary(req, res);
});

app.post("/report", (req, res) => {
  employee.getEmpReport(req, res);
});

app.post("/apply-career", (req, res) => {
  career.applyToCareer(req, res);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("listening at port 8000");
});
