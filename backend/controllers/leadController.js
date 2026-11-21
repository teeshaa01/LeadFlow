const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const { STATUSES } = require("../models/Lead");

const FIELDS = ["name", "email", "phone", "company", "source", "status"];

// Copy only the fields we allow from the request body
function pickLeadFields(body) {
  const data = {};
  FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rejectInvalidId(req, res) {
  if (mongoose.isValidObjectId(req.params.id)) return false;
  res.status(400).json({ message: "Invalid lead ID" });
  return true;
}

async function getLeads(req, res, next) {
  try {
    const filter = {};
    const search = String(req.query.search || "").trim();
    if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    next(error);
  }
}

async function getLeadStats(req, res, next) {
  try {
    const grouped = await Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const stats = { total: 0, New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    grouped.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

async function getLeadById(req, res, next) {
  try {
    if (rejectInvalidId(req, res)) return;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

async function createLead(req, res, next) {
  try {
    const lead = await Lead.create(pickLeadFields(req.body));
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
}

async function updateLead(req, res, next) {
  try {
    if (rejectInvalidId(req, res)) return;
    const lead = await Lead.findByIdAndUpdate(req.params.id, pickLeadFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

async function deleteLead(req, res, next) {
  try {
    if (rejectInvalidId(req, res)) return;
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeads, getLeadStats, getLeadById, createLead, updateLead, deleteLead };
