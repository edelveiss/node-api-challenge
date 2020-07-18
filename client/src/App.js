import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ProjectForm from "./components/ProjectForm";
import Project from "./components/Project";

const initialProject = {
  name: "",
  description: "",
  completed: false,
};

function App() {
  const [projects, setProjects] = useState([]);
  const [appUrl, setAppUrl] = useState("http://localhost:4000/api/projects");

  const [project, setProject] = useState(initialProject);
  const [eProject, setEProject] = useState(initialProject);

  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(appUrl)
      .then((response) => {
        setProjects(response.data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.log("error: ", err);
      });
  }, []);

  const addNewProject = () => {
    axios
      .post(appUrl, project)
      .then((response) => {
        //console.log("get response.data", response.data);
        setProjects([...projects, response.data]);
        setProject(initialProject);
        setError("");
      })
      .catch((err) => {
        // setError(err.response.statusText);
        setError(err.response.data.message);
        console.log("project error: ", err.response.data.message);
      });
  };

  const editProject = () => {
    axios
      .put(`${appUrl}/${eProject.id}`, eProject)
      .then((response) => {
        //console.log("resp data in put project", response);
        const newProjects = projects.map((u) => {
          if (u.id === eProject.id) {
            return response.data;
          } else {
            return u;
          }
        });
        setProjects(newProjects);
        setProject(initialProject);
        setEdit(false);
        setError("");
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log("err", err.response);
      });
  };
  const deleteProject = (project) => {
    axios
      .delete(`${appUrl}/${project.id}`)
      .then((response) => {
        //console.log("resp del", response);
        const newProjects = projects.filter((p) => p.id !== response.data.id);

        setProjects(newProjects);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  const handleAddChange = (e) => {
    //console.log("addchange", e.target.value);
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditChange = (e) => {
    e.persist();
    setProject({
      ...project,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
    setEProject({
      ...eProject,
      id: project.id,
      name: project.name,
      description: project.description,
      completed: project.completed,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };
  const handleAddNewProject = (e) => {
    e.preventDefault();
    addNewProject();
    setError("");
  };
  const handleEditProject = (e) => {
    e.preventDefault();
    editProject();
    setError("");
  };

  return (
    <div className="App">
      <div className="project-home">
        <div className="project">
          {projects.map((project) => (
            <Project
              key={project.id}
              project={project}
              deleteProject={deleteProject}
              editProject={editProject}
              handleChange={handleEditChange}
              edit={edit}
              setEdit={setEdit}
              setProject={setProject}
              error={error}
              setError={setError}
              appUrl={appUrl}
              eProject={eProject}
              setEProject={setEProject}
            />
          ))}
        </div>
        <ProjectForm
          handleAddNewProject={handleAddNewProject}
          project={project}
          setProject={setProject}
          handleAddChange={handleAddChange}
          handleEditChange={handleEditChange}
          handleEditProject={handleEditProject}
          edit={edit}
          setEdit={setEdit}
          error={error}
          setError={setError}
          eProject={eProject}
          setEProject={setEProject}
        />
      </div>
    </div>
  );
}

export default App;
