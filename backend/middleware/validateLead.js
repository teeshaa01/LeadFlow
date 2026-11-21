const { SOURCES, STATUSES } = require("../models/Lead");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns an object like { email: "message" }. Empty object means valid.
function getLeadErrors(data) {
  const errors = {};
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const phone = String(data.phone || "").trim();
  const company = String(data.company || "").trim();

  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";

  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Phone is required";
  else if (!/^\+?[\d\s\-()]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number (7-15 digits)";
  }

  if (!company) errors.company = "Company is required";
  if (!SOURCES.includes(data.source)) errors.source = "Choose a valid source";
  if (!STATUSES.includes(data.status)) errors.status = "Choose a valid status";

  return errors;
}

function validateLead(req, res, next) {
  const body = { status: "New", ...req.body };
  const errors = getLeadErrors(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
}

module.exports = validateLead;
