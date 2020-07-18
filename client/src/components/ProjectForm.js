import React from "react";

const ProjectForm = (props) => {
  const initialProject = {
    name: "",
    description: "",
    completed: false,
  };

  const cancelNewProject = (e) => {
    e.preventDefault();
    props.setProject(initialProject);
    props.setEdit(false);
    props.setError("");
  };

  return (
    <div className="project-form">
      <div style={{ width: "100%" }}>
        <h2
          style={{
            background: "#afeeed",
            textAlign: "center",
          }}
        >
          {props.edit ? "Update Project" : "Add new Project"}
        </h2>
      </div>
      <form
        onSubmit={
          props.edit ? props.handleEditProject : props.handleAddNewProject
        }
      >
        <label htmlFor="name">
          Name
          <textarea
            rows="3"
            cols="50"
            id="name"
            type="text"
            name="name"
            onChange={
              // props.handleChange
              props.edit ? props.handleEditChange : props.handleAddChange
            }
            value={props.project.name}
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            rows="4"
            cols="50"
            id="description"
            type="text"
            name="description"
            onChange={
              // props.handleChange
              props.edit ? props.handleEditChange : props.handleAddChange
            }
            value={props.project.description}
          />
        </label>

        <label htmlFor="completed" className="completed">
          <input
            type="checkbox"
            name="completed"
            checked={props.project.completed}
            onChange={props.handleEditChange}
          />
          Completed
        </label>

        {props.error && <div className="error">{props.error}</div>}
        <div style={{ display: "flex" }}>
          <button type="submit">Submit</button>
          <button style={{ marginLeft: "1rem" }} onClick={cancelNewProject}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProjectForm;
