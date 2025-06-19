const utilities = require("../utilities/utilities.js");
const modelReport = require("../Models/reports_model.js");

const getAllReports = async (req, res) => {
  try {
    const reports = await modelReport.find().populate({
      path: "userId",
      select: "firstName lastName email role", // se quiser apenas nome e email
    });
    res.json(reports);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createReport = async (req, res) => {
  try {
    const newReport = new modelReport({
      userId: req.body.userId,
      category: req.body.category,
      local: req.body.local,
      description: req.body.description || "",
      image: req.body.image || "",
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllReportsByUser = async (req, res) => {
  try {
    const userId = req.loggedUser._id;
    const reports = await modelReport.find({ userId: userId });
    res.json(reports);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    if (req.loggedUser.role === "worker") {
      const deletedReport = await modelReport.findByIdAndDelete({
        _id: reportId,
      });
      res.json({
        message: "Report deleted successfully, Worker",
        report: deletedReport,
      });
    } else {
      const deletedReport = await modelReport.findByIdAndDelete({
        _id: reportId,
        userId: req.loggedUser._id,
      });

      if (!deletedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json({
        message: "Report deleted successfully",
        report: deletedReport,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const updatedReport = await modelReport.findByIdAndUpdate(
      reportId,
      req.body,
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReportByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const reports = await modelReport.find({ userId: userId });
    res.json(reports);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  updateReport,
  getAllReports,
  createReport,
  deleteReport,
  getAllReportsByUser,
};
