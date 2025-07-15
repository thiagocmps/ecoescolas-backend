const mongoose = require("mongoose");

const monthlyExpense = new mongoose.Schema({
  creatorId: { type: String, required: true },
  activityId: { type: String, required: true },
  gasConsumption: { type: String, required: false },
  waterConsumption: { type: String, required: false },
  lightConsumption: { type: String, required: false },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MonthlyExpense = mongoose.model("Monthly expense", monthlyExpense);

module.exports = MonthlyExpense;
