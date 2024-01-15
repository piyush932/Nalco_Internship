import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    actionTaken: "",
    todo: "",
    openIssues: "",
    file: null,
    date: new Date(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const { files } = e.target;

    setFormData({
      ...formData,
      file: files[0],
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.projectName.trim() === "" ||
      formData.actionTaken.trim() === "" ||
      formData.todo.trim() === ""
    ) {
      toast.error("Please fill in all important details.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post("/api/projects", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data.error);

      if (response.status === 201) {
        console.log(response);
        console.log("Project added successfully!");
        toast.success("Form submitted");

        setFormData({
          projectName: "",
          actionTaken: "",
          todo: "",
          openIssues: "",
          file: null,
          date: new Date(),
        });
      } else {
        console.error("Failed to add project");
        toast.error("Error occured");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bigForm container">
      <h1>User Design System</h1>
      <div className="btn">
        <Link to="/projectDetails">
          <button>Project Details</button>
        </Link>
        <Link to="/openIssues">
          <button>Open Issues</button>
        </Link>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      ></Toaster>
      <form className="my-form" onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Action Taken:
          <input
            type="text"
            name="actionTaken"
            value={formData.actionTaken}
            onChange={handleInputChange}
          />
        </label>

        <label>
          To-Do:
          <input
            type="text"
            name="todo"
            value={formData.todo}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Open Issues:
          <input
            type="text"
            name="openIssues"
            value={formData.openIssues}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Date:
          <DatePicker selected={formData.date} onChange={handleDateChange} />
        </label>

        <label>
          File Upload:
          <input type="file" name="file" onChange={handleFileUpload} />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
