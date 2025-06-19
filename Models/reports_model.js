const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  status: { type: String, required: false, default: "pending" },
  category: { type: String, required: true },
  local: {
    bloco: { type: String, required: true },
    sala: { type: String, required: true },
  },
  description: { type: String, required: false },
  image: { type: Array, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Reports = mongoose.model("Reports", reportsSchema);

module.exports = Reports;
