const modelActivity = require("../Models/activities_model.js");
const modelRegistration = require("../Models/registrations_model.js");
const modelUser = require("../Models/users_model.js");

const getAllActivities = async (req, res) => {
  try {
    if (req.query) {
      const filter = req.query;
      const activities = await modelActivity.find(filter);
      res.status(200).json(activities);
    } else {
      const activities = await modelActivity.find();
      res.status(200).json(activities);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter atividades" });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const registrations = await modelRegistration.find({
      activityId: req.params.id,
    });

    const userIds = [...new Set(registrations.map((reg) => reg.userId.toString()))];
    const users = await modelUser.find(
      { _id: { $in: userIds } },
      { password: 0 }
    );

    const usersMap = new Map();
    users.forEach((user) => {
      const userObj = user.toObject();
      const match = userObj.email.match(/^([0-9]{8})@esmad\.ipp\.pt$/);
      const numMecanografico = match ? match[1] : null;

      usersMap.set(userObj._id.toString(), {
        ...userObj,
        numMecanografico,
      });
    });

    const result = registrations.map((reg) => {
      const user = usersMap.get(reg.userId.toString());
      return {
        ...user,
        registrationData: {
          images: reg.images,
          status: reg.status,
          createdAt: reg.createdAt,
        },
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    console.error(error);
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
      console.error(error);
    }
    
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMembers = getAllMembers;
exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
exports.addActivity = addActivity;
exports.getAllActivities = getAllActivities;
