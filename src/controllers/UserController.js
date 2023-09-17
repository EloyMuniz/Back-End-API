import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
class UsersController {
  async store(req, res) {
    try {
      const { name, email, password, confirm_password } = req.body;
      console.log(name, email, password, confirm_password);

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
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          use_name: name,
          use_email: email,
          use_password: passwordHash,
        },
      });

      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao criar o usuário: ${error.message}` });
    }
  }
}
export default new UsersController();
