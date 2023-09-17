//Importação de bibliotecas/frameworks
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

class UsersController {
  async store(req, res) {
    //Bloco try{}catch para captar possíveis erros
    try {
      //Informações que serão recebidas no corpo da requisição
      const { name, email, password, confirm_password } = req.body;
      console.log(name, email, password, confirm_password);
      //Verificando se o email já existe no banco
      const verifyemail = await prisma.user.findUnique({
        where: {
          use_email: email,
        },
        select: {
          use_email: true,
        },
      });

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (name.length < 4) {
        return res
          .status(400)
          .json({ message: "O nome deve conter quatro ou mais caracteres!" });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "O email não é válido." });
      }
      if (verifyemail) {
        return res.status(400).json({ message: "O email já existe!" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha deve ter seis ou mais caracteres!" });
      }
      if (password != confirm_password) {
        return res.status(400).json({
          message: "A senha e a confirmação de senha não são iguais!",
        });
      }
      //Criação de um hash para criptografar a senha
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          use_name: name,
          use_email: email,
          use_password: passwordHash,
        },
      });

      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso!", email });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao criar o usuário: ${error.message}` });
    }
  }
  async emailRecover(req, res) {
    try {
      const { email } = req.body;
      const search = await prisma.user.findUnique({
        where: {
          use_email: email,
        },
      });
      if (!search) {
        return res.status(400).json({ message: "Esse email não existe!" });
      }
      //Criação de um token de acesso 
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          id: search._id,
        },
        secret,
        {
          expiresIn: "1h", // O token expirará em uma hora
        }
      );
      await prisma.user.update({
        where: {
          use_email: email,
        },
        data: {
          use_token: token,
        },
      });
      //Configurando credenciais de envio do email
      const transporter = nodemailer.createTransport({
        service: "",
        auth: {
          user: "",
          pass: "",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      //Construção do email
      const mailOptions = {
        from: "",
        to: email,
        subject: "Recuperação de Senha",
        html: `
        <p>Clique no link abaixo para recuperar sua senha:</p>
        <a href="'url'/passrecover?use_token=${token}&use_email=${email}">Recuperar Senha</a>
      `,
      };
      //Envio do email 
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Erro ao enviar o email." });
        } else {
          return res.status(200).json({
            token: token,
            message: "Token enviado para o email inserido!",
          });
        }
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao enviar email:${error.message}` });
    }
  }
  async recoverPass(req, res) {
    try {
      const { email, token } = req.query;
      const { password } = req.body;
      const result = await prisma.user.findFirst({
        where: { use_email: email },
      });
      if (!result) {
        return res.status(400).json({ message: "Email inválido!" });
      }

      try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          return res.status(401).json({ message: "Token expirado." });
        }
      } catch (err) {
        return res.status(401).json({ message: "Token inválido." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha precisa ter 6 ou mais caracteres!" });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      await prisma.user.update({
        data: { use_password: passwordHash },
        where: {
          use_email: email,
        },
      });
      return res.status(200).json({
        message: "Senha atualizada com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar nova senha!" });
    }
  }
}
export default new UsersController();
