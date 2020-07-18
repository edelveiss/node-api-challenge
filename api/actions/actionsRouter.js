const express = require("express");
const Actions = require("../../data/helpers/actionModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
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

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.delete("/:id", validateActionId, (req, res) => {
  Actions.remove(req.action.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json(req.action);
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the action",
      });
    });
});

router.put("/:id", validateActionId, validateAction, (req, res) => {
  Actions.update(req.action.id, req.body)
    .then((count) => {
      if (count) {
        Actions.get(req.action.id)
          .then((action) => {
            res.status(200).json(action);
          })
          .catch((err) => {
            req
              .status(500)
              .json({ message: "An error occured during getting action" });
          });
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the action",
      });
    });
});

// custom middleware

function validateActionId(req, res, next) {
  const { id } = req.params;
  Actions.get(id)
    .then((action) => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.statusMessage = "invalid action id";
        res.status(400).json({ message: "invalid action id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "failed", err });
    });
}
function validateAction(req, res, next) {
  if (!(Object.keys(req.body).length === 0)) {
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
      next();
    }
  } else {
    res.statusMessage = "missing action data";
    res.status(400).json({ message: "missing action data" });
  }
}

module.exports = router;
