import React, { useState, useEffect } from "react";
import axios from "axios";

const initialAction = {
  description: "",
  notes: "",
  completed: false,
  project_id: "",
};

const Project = (props) => {
  const [actionToggle, setActionToggle] = useState(false);
  const [action, setAction] = useState(initialAction);
  const [actions, setActions] = useState([]);
  const [addAction, setAddAction] = useState(false);
  const [commError, setCommError] = useState("");
  useEffect(() => {
    axios
      .get(`${props.appUrl}/${props.project.id}/actions`)
      .then((response) => {
        //console.log("get response.data", response.data);
        setActions(response.data);
        setCommError("");
      })
      .catch((err) => {
        setCommError(err.message);
        console.log("error: ", err);
      });
  }, [props.project.id]);

  const deleteAction = (actionID) => {
    axios
      .delete(`http://localhost:4000/api/actions/${actionID}`)
      .then((response) => {
        //console.log("resp del", response);
        const newActions = actions.filter((a) => a.id !== response.data.id);

        setActions(newActions);
        props.setError("");
      })
      .catch((err) => {
        props.setError(err.message);
      });
  };

  const toggleTrue = () => {
    props.setEdit(true);
    props.setProject(props.project);
  };
  const handleDeleteProject = (e) => {
    e.preventDefault();
    props.deleteProject(props.project);
  };
  const handleDeleteAction = (a) => {
    //e.preventDefault();
    deleteAction(a.id);
  };
  const toggleTrueAction = () => {
    setActionToggle(true);
  };
  const toggleFalseAction = () => {
    setActionToggle(false);
  };
  const toggleTrueAddAction = () => {
    setAddAction(true);
  };
  const toggleFalseAddAction = () => {
    setAddAction(false);
    setCommError("");
    setAction(initialAction);
  };
  //handle Actions
  const addNewAction = () => {
    axios
      .post(`${props.appUrl}/${props.project.id}/actions`, action)
      .then((response) => {
        setActions([...actions, response.data]);
        setAction(initialAction);
        setCommError("");
      })
      .catch((err) => {
        setCommError(err.response.statusText);
        console.log("project error: ", err.message);
      });
  };
  const handleAddActionChange = (e) => {
    setAction({
      ...action,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
      project_id: props.project.id,
    });
  };
  const handleAddNewAction = (e) => {
    e.preventDefault();
    addNewAction();
    setCommError("");
  };

  return (
    <div className="project-list ">
      <div>
        <h2>Project Name: {props.project.name}</h2>
        <p>Project Description: {props.project.description}</p>
        <p>Completed: {props.project.completed ? "Yes" : "No"}</p>
        <p> Project id: {props.project.id}</p>

        <button onClick={toggleTrue} className="item-button">
          Update
        </button>

        <button onClick={handleDeleteProject} className="item-button">
          Delete
        </button>
      </div>

      {!actionToggle && (
        <div
          onClick={toggleTrueAction}
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <h3 style={{ color: "grey" }}>Read Actions... </h3>
        </div>
      )}

      {actionToggle && (
        <div className="actions">
          {actions.map((a, index) => (
            <div key={index} className="action-delete">
              <div className="action">
                <p>Description: {a.description}</p>
                <p>Notes: {a.notes}</p>
                <p>Completed: {a.completed ? "yes" : "No"}</p>
              </div>
              <div
                onClick={() => {
                  handleDeleteAction(a);
                }}
                className="cross"
              >
                X
              </div>
            </div>
          ))}
          {addAction && (
            <form onSubmit={handleAddNewAction}>
              <label htmlFor="description">
                Description
                <input
                  id="description"
                  type="text"
                  name="description"
                  onChange={handleAddActionChange}
                  value={action.description}
                />
              </label>
              <label htmlFor="notes">
                Notes
                <input
                  id="notes"
                  type="text"
                  name="notes"
                  onChange={handleAddActionChange}
                  value={action.notes}
                />
              </label>
              <label htmlFor="completed" className="completed">
                <input
                  type="checkbox"
                  name="completed"
                  checked={action.completed}
                  onChange={handleAddActionChange}
                />
                Completed
              </label>
              {commError && <div className="error">{commError}</div>}
              <div style={{ display: "flex" }}>
                <button type="submit">Submit</button>
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={toggleFalseAddAction}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <button onClick={toggleTrueAddAction} className="item-button">
            Add Action
          </button>

          <div
            onClick={toggleFalseAction}
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "black" }}>Hide Actions... </h3>
          </div>
        </div>
      )}
    </div>
  );
};
export default Project;
