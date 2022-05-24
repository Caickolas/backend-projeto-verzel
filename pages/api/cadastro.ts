import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import { politicaCORS } from '../../middlewares/politicaCORS';


const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {        
            if(req.method === 'POST'){
            const {nome, email, senha} = req.body;

            if (!nome ) {
                return res.status(400).json({ erro: 'informe um nome valido' });
            }

            if (!email || email.length < 5
                || !email.includes('@')
                || !email.includes('.')) {
                return res.status(400).json({ erro: 'Email invalido' });
            }

            if (!senha || senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida' });
            }

            
            
            const usuariosComMesmoEmail = await UsuarioModel.find({ email: email });
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({ erro: 'Ja existe uma conta com o email informado' });
            }

            const usuarioASerSalvo = {
                nome: nome,
                email: email,
                senha: md5(senha),               
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({ msg: 'Usuario criado com sucesso' });
        } 
        {
        return res.status(405).json({erro: 'Metodo informado não é valido'});
        }
    };

export default politicaCORS(conectarMongoDB(endpointCadastro));