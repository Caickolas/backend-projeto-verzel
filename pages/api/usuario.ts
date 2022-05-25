import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from "../../models/UsuarioModel";
import nc from "next-connect";
import { politicaCORS } from "../../middlewares/politicaCORS";

const handler = nc()
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
        try {
            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null
            return res.status(200).json({ usuario })

        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({ erro: 'Nao foi possivel obter dados do usuario'})
    });

export default politicaCORS(conectarMongoDB(handler));