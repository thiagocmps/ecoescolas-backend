const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  visible: { type: Boolean, required: true, default: true },
  info: { type: Object, required: true,
    enquadramento: { type: String, required: true },
    objetivos: { type: String, required: true },
    atividade: { type: String, required: true },
    info_solicitada: { type: String, required: true },
    prazos: { type: String, required: true },
    criterio_de_avaliacao: { type: String, required: true },
    juri: { type: Array, required: true },
    premios_mencoes_honrosas: { type: String, required: false },
    cover: { type: String, required: true },
  },
});

const Activities = mongoose.model("Activities", activitySchema);

module.exports = Activities;
