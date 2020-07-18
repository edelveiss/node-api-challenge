const express = require("express");
const Projects = require("../../data/helpers/projectModel.js");
const Actions = require("../../data/helpers/actionModel.js");
const router = express.Router();

router.post("/", validateProject, (req, res) => {
  Projects.insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the project",
      });
    });
});

router.post("/:id/actions", validateProjectId, validateAction, (req, res) => {
  Actions.insert(req.action)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the action",
      });
    });
});

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the projects",
      });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectId, (req, res) => {
  Projects.getProjectActions(req.project.id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the actions",
      });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  Projects.remove(req.project.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json(req.project);
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the project",
      });
    });
});

router.put("/:id", validateProjectId, validateProject, (req, res) => {
  Projects.update(req.project.id, req.body)
    .then((count) => {
      if (count) {
        Projects.get(req.project.id)
          .then((project) => {
            res.status(200).json(project);
          })
          .catch((err) => {
            req
              .status(500)
              .json({ message: "An error occured during getting project" });
          });
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch((error) => {
      res.statusMessage = "Error updating the project";
      console.log(error);
      res.status(500).json({
        message: "Error updating the project",
      });
    });
});

//custom middleware
function validateProjectId(req, res, next) {
  const { id } = req.params;
  Projects.get(id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: "invalid project id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "failed", err });
    });
}

function validateProject(req, res, next) {
  if (!isEmpty(req.body)) {
    if (!req.body.name && !req.body.description) {
      res.statusMessage = "missing required name and description fields";
      res.status(400).json({ message: "missing required name field" });
      // res.status(400).end();
    } else if (!req.body.name) {
      res.statusMessage = "missing required name field";
      res.status(400).json({ message: "missing required name field" });
      // res.status(400).end();
    } else if (!req.body.description) {
      res.statusMessage = "missing required description field";
      res.status(400).json({ message: "missing required description field" });
    } else {
      next();
    }
  } else {
    res.statusMessage = "missing project data";
    res.status(400).json({ message: "missing project data" });
  }
}

function validateAction(req, res, next) {
  if (!isEmpty(req.body)) {
    if (!req.body.description) {
      res.statusMessage = "missing required description field";
      res.status(400).json({ message: "missing required description field" });
    } else if (!req.body.notes) {
      res.statusMessage = "missing required notes field";
      res.status(400).json({ message: "missing required notes field" });
    } else if (req.body.description.length > 128) {
      res.statusMessage = "description field must be up to 128 characters long";
      res.status(400).json({
        message: "description field must be up to 128 characters long",
      });
    } else {
      req.action = {
        ...req.body,
        project_id: req.project.id,
      };
      next();
    }
  } else {
    res.statusMessage = "missing action data";
    res.status(400).json({ message: "missing action data" });
  }
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = router;
