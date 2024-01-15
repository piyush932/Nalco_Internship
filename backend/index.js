const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Project = require("./Models/model");
const fs = require("fs");

require("dotenv").config();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = file.originalname;
    cb(null, uniqueFilename);
    req.uniqueFilename = uniqueFilename;
  },
});

const upload = multer({ storage: storage });

app.post("/api/projects", upload.single("file"), async (req, res) => {
  try {
    const { projectName, actionTaken, todo, openIssues, date } = req.body;
    console.log(req);

    const project = new Project({
      projectName,
      actionTaken,
      todo,
      openIssues,
      date,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      },
    });

    await project.save();

    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  console.log(fileName);
  const filePath = path.join(__dirname, "uploads", fileName);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-disposition", "attachment; filename=" + fileName);
    res.setHeader("Content-type", "application/octet-stream");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    await Project.deleteOne({ _id: projectId });

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/uploads", express.static("uploads"));

const port = 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
