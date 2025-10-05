import mongoose from "mongoose";

const llamadaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fecha: { type: Date, default: Date.now },
  duracion: Number,
  contestada: Boolean,
  acuerdo: Boolean
});

const Llamada = mongoose.model("Llamada", llamadaSchema);

export default Llamada;
