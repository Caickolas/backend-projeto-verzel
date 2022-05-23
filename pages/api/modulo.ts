import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT'
import {UsuarioModel} from '../../models/UsuarioModel'
import {ModuloModel} from '../../models/ModuloModel'
import nc from "next-connect";


const handler = nc() 
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{        

                const {userId} = req.query;
                const usuario = await UsuarioModel.findById(userId)

                if(!usuario){
                    return res.status(400).json({ erro: 'usuario não encontrado' }) 
                }

                if(usuario.role !== 'admin' ){
                    return res.status(401).json({ erro: 'Você não tem permissão' })
                }

                const {nome} = req?.body;

                if (!req || !req.body){
                    return res.status(400).json({ erro: 'Parametro de entrada não informado' })
                }

                if (!nome || nome.length < 1) {
                    return res.status(400).json({ erro: 'Nome não é valido' })
                }
                
                const Modulo = { 
                    idUsuario : usuario._id,
                    nome 
                };  

                    await ModuloModel.create(Modulo);
                    return res.status(200).json({ msg: 'Modulo cadastrado com sucesso!' })
                             
            }catch(e){
                console.log(e);
                return res.status(500).json({ msg: 'erro ao cadastrar modulo' });
            }
        })
    .put(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg> ) => {
        try {
            if(req?.query?.id){
                const modulo = await ModuloModel.findById(req?.query?.id)

                const{nome} = req.body;
            if(nome && nome.length > 2){
                usuario.nome = nome
            };
            }else{
                res.status(400).json({ erro: 'Modulo nao encontrado' })
            }
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: 'erro ao atualizar modulo' });           
        }
    })
    
    
export default (validarTokenJWT(conectarMongoDB(handler)));
