import type {NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import mongoose from "mongoose";
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg'

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
 
        const {DB_CONEXAO_STRING} = process.env;

        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro: 'ENV de configuração do banco, não informado'});
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados conectado com sucesso'));
        mongoose.connection.on('error', error => console.log('Ocorreu um erro ao conectar no banco de dados'));
        await mongoose.connect(DB_CONEXAO_STRING);

        return handler(req, res);
    };