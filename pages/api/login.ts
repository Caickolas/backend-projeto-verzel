import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import {UsuarioModel} from '../../models/UsuarioModel';
import type {RespostaPadraoMsg}  from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const endpointLogin = async ( req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {    

    const { CHAVE_JWT } = process.env;
    if (!CHAVE_JWT){
    return res.status(500).json({erro : 'ENV Jwt nao informada'});
    }
        
    if(req.method === 'POST'){
        const {login, senha} = req.body;

    const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)})
    if(usuariosEncontrados && usuariosEncontrados.length > 0){
        const usuarioEncontrado = usuariosEncontrados[0]


        const token = jwt.sign({_id : usuarioEncontrado._id}, CHAVE_JWT);
        return res.status(200).json({
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email,
            token
        });
    }
}
return res.status(405).json({erro: 'Metodo informado não é valido'});
};

export default conectarMongoDB(endpointLogin);
