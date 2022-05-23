import type {NextApiRequest, NextApiResponse} from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT'
import {UsuarioModel} from '../../models/UsuarioModel'
import {ModuloModel} from '../../models/ModuloModel'
import {AulaModel} from '../../models/AulaModel'
import nc from "next-connect";


const handler = nc() 
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{        
            const {userId, id} = req.query;
            const usuario = await UsuarioModel.findById(userId)
                
            if(!usuario){
                return res.status(400).json({ erro: 'Usuario não encontrado' }) 
            }
                
            if(usuario.role !== 'admin' ){
                return res.status(401).json({ erro: 'Você não tem permissão' })
            }
                
            const moduloASerAdicionado = await ModuloModel.findById(id)

            if(!moduloASerAdicionado){
                return res.status(400).json({ erro: 'Modulo não encontrado' })
            }


            const {nome, dataDaAula} = req?.body;
                

            if (!req || !req.body){
                return res.status(400).json({ erro: 'Parametro de entrada não informado' })
            }

            if (!nome || nome.length < 1) {
                return res.status(400).json({ erro: 'Nome não é valido' })
            }

            if (!dataDaAula){
                return res.status(400).json({ erro: 'É necessario informar a data da aula'})
            }
                                
            const Aula = { 
                idUsuario : usuario._id,
                idModulo : moduloASerAdicionado._id,
                nome,
                dataDaAula
            }; 

            await AulaModel.create(Aula);
            moduloASerAdicionado.aulas++
            await ModuloModel.findByIdAndUpdate({_id: moduloASerAdicionado._id}, moduloASerAdicionado)
            res.status(200).json({ msg: 'Aula cadastrada com sucesso!'})                                   
            
        }catch(e){
            console.log(e);
            res.status(500).json({ msg: 'erro ao cadastrar aula'});
        }
    })
    .put(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg> ) => {
        try {
            if(req.query.id){
                const aula = await AulaModel.findById(req.query.id);

                const{nome, dataDaAula} = req.body;
                if(nome && nome.length > 1){
                    aula.nome = nome
                }

                if(dataDaAula && dataDaAula.length > 2){
                    aula.dataDaAula = dataDaAula
                }
                
                await AulaModel.findByIdAndUpdate({_id : aula._id}, aula)
                res.status(200).json({msg : "Aula alterada com sucesso"})
            }else{
                res.status(400).json({ erro: 'Aula nao encontrada' })
            };
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: 'erro ao atualizar aula' });           
        };
    })
    .delete(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg> ) => {
        try {
            if(req.query.id){
                const aula = await AulaModel.findById(req.query.id);
               
                await AulaModel.findByIdAndDelete({_id : aula._id}, aula)
                res.status(200).json({msg : "Aula deletada com sucesso"})
            }else{
                res.status(400).json({ erro: 'Aula nao encontrada' })
            };
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({ erro: 'erro ao deletar aula' });           
        };
    })
        
        
export default (validarTokenJWT(conectarMongoDB(handler)));
