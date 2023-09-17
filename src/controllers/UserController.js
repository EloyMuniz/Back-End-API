//Importação de bibliotecas/frameworks
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
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
        .json({ message: "Usuário criado com sucesso!", verifyemail });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao criar o usuário: ${error.message}` });
    }
  }
  async emailRecover(req, res) {
    try {
      const email = req.body;
      const result = await prisma.user.findUnique({
        where: {
          use_email: email,
        },
      });
      if (result) {




        
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao enviar email:${error.message}` });
    }
  }
}
export default new UsersController();
