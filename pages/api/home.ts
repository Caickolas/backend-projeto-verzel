import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";
import { ModuloModel } from '../../models/ModuloModel';
import modulo from "./modulo";





const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const modulo = await ModuloModel
                .findById(req?.query?.id)
                .sort({data : -1});
                if(!modulo){
                    res.status(400).json({ erro: 'Modulo nao encontrado' })
                }

            }else{
                const {userId} = req.query;
                const admin = await UsuarioModel.findById(userId)
                const modulo = await ModuloModel.find({idUsuario : admin._id})
                const modulosIds = await modulo.map(m => m._id);

                const modulos = await ModuloModel.find({
                    
                })

            }
        }
    }catch(e){
        
    }
}
