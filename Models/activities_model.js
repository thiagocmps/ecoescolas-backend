const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  visible: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  info: { type: Object, required: true,
    enquadramento: { type: String, required: false, default: "" },
    objetivos: { type: String, required: true, default: ""  },
    atividade: { type: String, required: false, default: "" },
    info_solicitada: { type: String, required: false, default: "" },
    prazos: { type: String, required: true, default: "" },
    criterio_de_avaliacao: { type: String, required: true, default: "" },
    juri: { type: Array, required: true, default: [] },
    premios_mencoes_honrosas: { type: String, required: false, default: "" },
    cover: { type: String, required: false, default: "" },
    images: { type: Array, required: false },
  },
});

const Activities = mongoose.model("Activities", activitySchema);

module.exports = Activities;  
