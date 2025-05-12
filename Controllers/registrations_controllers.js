const modelActivity = require("../Models/activities_model.js");
const modelRegistration = require("../Models/registrations_model.js");

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await modelRegistration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter atividades" });
  }
};

const getRegistrationByUser = async (req, res) => {
  try {
    const registrations = await modelRegistration.find({
      userId: req.loggedUser._id,
    });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter atividades do utilizador" });
  }
};

/* FEITO  */
const addRegistration = async (req, res) => {
  try {
    let isActivityValid = false;
    activityId = req.body.activityId;
    const existingRegistration = await modelRegistration.findOne({
      userId: req.loggedUser._id,
      activityId: req.body.activityId,
    });

    isActivityValid = await modelActivity.findOne({
      _id: req.body.activityId,
    });

    if (isActivityValid == null) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }

    if (existingRegistration) {
      return res
        .status(409)
        .json({ message: "Aluno já registado nesta atividade" });
    }

    if (!isActivityValid) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }

    const registration = new modelRegistration({
      activityId: req.body.activityId,
      userId: req.loggedUser._id,
      status: "pending",
    });
    await registration.save();
    res.status(201).json({ message: "Registro feito com sucesso" });
  } catch (error) {
    if (!req.body.activityId) {
      return res.status(400).json({ error: "ID da atividade é obrigatório" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getFilterRegistration = async (req, res) => {
  try {
    const filter = req.query;
    const registrations = await modelRegistration.find(filter);
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter atividades" });
  }
};

exports.getFilterRegistration = getFilterRegistration;
exports.addRegistration = addRegistration;
exports.getAllRegistrations = getAllRegistrations;
exports.getRegistrationByUser = getRegistrationByUser;
