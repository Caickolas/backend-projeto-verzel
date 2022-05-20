import mongoose, { Schema } from 'mongoose';

const ModuloSchema = new Schema({
    idUsuario: { type: String, required: true },
    nome: { type: String, required: true },
    aulas: { type: Number, default: 0 },
})

export const ModuloModel = (mongoose.models.modulos || 
    mongoose.model('modulos', ModuloSchema));