import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import { politicaCORS } from '../../middlewares/politicaCORS';


const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {        
            if(req.method === 'POST'){
            const usuario = req.body as CadastroRequisicao;

            if (!usuario.nome) {
                return res.status(400).json({ erro: 'informe um nome valido' });
            }

            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ erro: 'Email invalido' });
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida' });
            }

            
            
            const usuariosComMesmoEmail = await UsuarioModel.find({ email: usuario.email });
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({ erro: 'Ja existe uma conta com o email informado' });
            }

            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                role: usuario.role
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({ msg: 'Usuario criado com sucesso' });
        } 
        {
        return res.status(405).json({erro: 'Metodo informado não é valido'});
        }
    };

export default politicaCORS(conectarMongoDB(endpointCadastro));