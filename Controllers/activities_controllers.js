const modelActivity = require("../Models/activities_model.js");
const modelRegistration = require("../Models/registrations_model.js");

const getAllActivities = async (req, res) => {
  try {
    const activities = await modelActivity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter atividades" });
  }
};

const addActivity = async (req, res) => {
  try {
    const activity = new modelActivity({
      title: req.body.title,
      description: req.body.description,
      creatorId: req.loggedUser._id,
      date: req.body.date,
      info: req.body.info,
    });
    await activity.save();
    res.status(201).json({ message: "Atividade criada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await modelActivity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    await modelRegistration.deleteMany({ activityId: req.params.id });
    res.json({ message: "Atividade excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await modelActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!activity) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
exports.addActivity = addActivity;
exports.getAllActivities = getAllActivities;
