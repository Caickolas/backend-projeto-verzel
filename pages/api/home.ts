import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";
import { ModuloModel } from '../../models/ModuloModel';






const homeEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const modulo = await ModuloModel
                .findById(req?.query?.id)
                .sort(1);
                if(!modulo){
                    res.status(400).json({ erro: 'Modulo nao encontrado' })
                }

            }else{
                const {userId} = req.query;
                const usuarioLogado = await UsuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }
                const modulo = await ModuloModel.find({idUsuario : usuarioLogado._id})
                const modulosIds = await modulo.map(m => m._id);

                const modulos = await ModuloModel.find({
                    idModulo : modulosIds
                })
                .sort(1)
            }
            return res.status(405).json({erro: 'Metodo informado não é valido'})
        }
    }catch(e){
        console.log(e)
    }
    res.status(400).json({erro: 'Nao foi possivel obter o home'});
};

export default (conectarMongoDB(homeEndpoint));
