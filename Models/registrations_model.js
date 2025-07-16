const mongoose = require("mongoose");

const monthlyExpenseSchema = new mongoose.Schema(
  {
    gas: { type: String },
    water: { type: String },
    light: { type: String },
    date: { type: Date },
  },
  { _id: false } // evitar criação de _id automático para subdocumentos, se quiser
);

const registrationsSchema = new mongoose.Schema({
  activityId: { type: String, required: true },
  userId: { type: String, required: true },
  creatorId: { type: String, required: true },
  images: { type: [String], required: false },
  monthlyExpense: {
    type: [monthlyExpenseSchema],
    required: false,
  },
  status: { type: String, required: false, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Registrations = mongoose.model("Registrations", registrationsSchema);

module.exports = Registrations;
