import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { AulaModel } from "../../models/AulaModel";
import { ModuloModel } from '../../models/ModuloModel';






const homeEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const modulo = await ModuloModel.findById(req?.query?.id)
                
                if(!modulo){
                    res.status(400).json({ erro: 'Modulo nao encontrado' })
                }
                
                const aulas = await AulaModel.find({idModulo : req?.query?.id})
                .sort({nome : 1})

                return res.status(200).json(aulas)

            }else{
                const modulos = await ModuloModel.find()
                .sort({nome : 1})

                return res.status(200).json({modulos})
                
            }
        }
        return res.status(405).json({erro: 'Metodo informado não é valido'})
    }catch(e){
        console.log(e)
    }
    res.status(400).json({erro: 'Nao foi possivel obter o home'});
};


export default (conectarMongoDB(homeEndpoint));