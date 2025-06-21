const modelActivity = require("../Models/activities_model.js");
const modelRegistration = require("../Models/registrations_model.js");

const deleteRegistration = async (req, res) => {
  try {
    const registration = await modelRegistration.findByIdAndDelete(
      req.params.id
    );
    if (!registration) {
      return res.status(404).json({ message: "Registo não encontrado" });
    }
    res.json({ message: "Registo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRegistrationByUser = async (req, res) => {
  try {
    const registration = await modelRegistration.findOneAndDelete({
      userId: req.query.userId,
      activityId: req.query.activityId,
    });
    if (!registration) {
      return res.status(404).json({ message: "Registo não encontrado" });
    }
    res.json({ message: "Registo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const activities = await modelActivity.find({
      _id: { $in: registrations.map((r) => r.activityId) },
    });

    const merged = registrations.map((reg) => ({
      ...reg.toObject(),
      activity:
        activities.find((act) => act._id.equals(reg.activityId)) || null,
    }));
    res.status(200).json(merged);
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
      creatorId: req.body.creatorId,
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

const updateRegistration = async (req, res) => {
  try {
    const { userId, activityId, status } = req.body;

    if (!userId || !activityId || !status) {
      return res
        .status(400)
        .json({ message: "Parâmetros obrigatórios ausentes." });
    }

    const registration = await modelRegistration.findOneAndUpdate(
      { userId, activityId },
      { status },
      { new: true }
    );

    if (!registration) {
      console.log("Registo não encontrado");
      return res.status(404).json({ message: "Registo não encontrado" });
    }
    console.log(registration);
    res.json(registration);
  } catch (error) {
    console.error("Erro ao atualizar o registo:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRegistrationByUser = deleteRegistrationByUser;
exports.getFilterRegistration = getFilterRegistration;
exports.addRegistration = addRegistration;
exports.getAllRegistrations = getAllRegistrations;
exports.getRegistrationByUser = getRegistrationByUser;
exports.updateRegistration = updateRegistration;
