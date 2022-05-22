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
                
                if(!modulo){
                    res.status(400).json({ erro: 'Modulo nao encontrado' })
                }

                const modulos = await ModuloModel.find({idModulo: modulo._id})
                
                
                return res.status(200).json(modulos)

            }else{
                const {userId} = req.query;
                const usuario = await UsuarioModel.findById(userId)
                if(!usuario){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }
                const modulo = await ModuloModel.find({idUsuario : usuario._id})
                const modulosIds = await modulo.map(m => m._id);

                const modulos = await ModuloModel.find({
                    idModulos : modulosIds
                })
                return res.status(200).json(modulos)
            }
        }
        return res.status(405).json({erro: 'Metodo informado não é valido'})
    }catch(e){
        console.log(e)
    }
    res.status(400).json({erro: 'Nao foi possivel obter o home'});
};

export default (conectarMongoDB(homeEndpoint));