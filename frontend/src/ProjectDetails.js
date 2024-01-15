import React, { useEffect, useState } from "react";
import axios from "axios";
import "./projectDetails.css";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const displayImage = (file) => (
    <img src={`/uploads/${file.fileName}`} alt="Project" />
  );

  const displayVideo = (file) => (
    <video controls width="300">
      <source src={`/uploads/${file.fileName}`} type={file.contentType} />
    </video>
  );

  const displayOtherFile = (file) => (
    <div>
      <strong>File:</strong>
      <a
        href={`http://localhost:5000/api/download/${file.fileName}`}
        download={file.fileName}
      >
        Download to view
      </a>
    </div>
  );

  const displayFile = (file) => {
    const fileType = file.contentType;

    switch (true) {
      case fileType.startsWith("image/"):
        return displayImage(file);
      case fileType.startsWith("video/"):
        return displayVideo(file);
      default:
        return displayOtherFile(file);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div>
      <Link to="/">
        <button>Home</button>
      </Link>
      <h1>Project List</h1>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <strong>Project Name:</strong> {project.projectName} <br />
            <strong>Action Taken:</strong> {project.actionTaken} <br />
            <strong>Open Issues:</strong> {project.openIssues} <br />
            <strong>ToDo:</strong> {project.todo} <br />
            <strong>Date:</strong>{" "}
            {project.date
              ? new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No date"}{" "}
            <br />
            {project.file && (
              <div className="file">{displayFile(project.file)}</div>
            )}
            <button onClick={() => handleDelete(project._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;
