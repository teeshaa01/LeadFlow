const mongoose = require("mongoose");

const SOURCES = ["Website", "Referral", "LinkedIn", "Cold Call", "Event", "Other"];
const STATUSES = ["New", "Contacted", "Qualified", "Lost"];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    source: { type: String, enum: SOURCES, required: true },
    status: { type: String, enum: STATUSES, default: "New" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
module.exports.SOURCES = SOURCES;
module.exports.STATUSES = STATUSES;
