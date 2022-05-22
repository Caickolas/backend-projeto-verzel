import mongoose, { Schema } from 'mongoose';

const AulaSchema = new Schema({
    idUsuario: { type: String, required: true },
    idModulo: { type: String, required: true },
    nome: { type: String, required: true },
    dataDaAula: { type: String, required: true },
    
})

export const AulaModel = (mongoose.models.aulas || 
    mongoose.model('aulas', AulaSchema));