const express = require("express");
const controller = require("../controllers/leadController");
const validateLead = require("../middleware/validateLead");

const router = express.Router();

router.get("/", controller.getLeads);
router.get("/stats", controller.getLeadStats); // must stay above "/:id"
router.get("/:id", controller.getLeadById);
router.post("/", validateLead, controller.createLead);
router.put("/:id", validateLead, controller.updateLead);
router.delete("/:id", controller.deleteLead);

module.exports = router;
