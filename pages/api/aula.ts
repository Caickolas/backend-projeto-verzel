import type {NextApiResponse} from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT'
import {UsuarioModel} from '../../models/UsuarioModel'
import {ModuloModel} from '../../models/ModuloModel'
import {AulaModel} from '../../models/AulaModel'


const endpointAula = async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{        
            if(req.method === 'POST'){

            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId)

            if(!usuario){
                return res.status(400).json({ erro: 'usuario não encontrado' }) 
            }

            if(usuario.role !== 'admin' ){
                return res.status(401).json({ erro: 'Você não tem permissão' })
            }


            const {nome, dataDaAula, nomeModulo} = req?.body;
            

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
                nomeModulo,
                nome,
                dataDaAula
            };
        
                
                await AulaModel.create(Aula);
                return res.status(200).json({ msg: 'Aula cadastrada com sucesso!' })
            
            }
                return res.status(405).json({ erro: 'Metodo informado nao e valid' }); 
                
        
        }catch(e){
            console.log(e);
            return res.status(500).json({ msg: 'erro ao cadastrar aula' });
        }
    };
    
    
export default (validarTokenJWT(conectarMongoDB(endpointAula)));
