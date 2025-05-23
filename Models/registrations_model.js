const mongoose = require("mongoose");

const registrationsSchema = new mongoose.Schema({
  activityId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, required: false, default: "pending" },
});

const Registrations = mongoose.model("Registrations", registrationsSchema);

module.exports = Registrations;