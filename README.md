# APIs de fluxo de Registro, atualização e envio de email para usuário.

## registration-backend

Este é o back end de uma página de registro construída em Node.js. O objetivo deste projeto é criar um fluxo completo de APIs que permita:

1. **Criação de Conta:** Os usuários serão capazes de criar uma nova conta fornecendo as informações necessárias.

2. **Recuperação de Senha:** Implementar um mecanismo para permitir que os usuários recuperem suas senhas caso as esqueçam. Se a conta existir, será enviado um e-mail ao usuário com as instruções para a recuperação da senha.

## Funcionalidades

Além disso, este projeto incluirá:

- **Banco de Dados:** Utilizei o PostgreSQL para armazenar informações como email, senha, nome e tokens de usuários.

## Bibliotecas Utilizadas

## Bibliotecas Utilizadas

- [bcrypt](https://www.npmjs.com/package/bcrypt): ^5.1.0
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.3.1
- [express](https://www.npmjs.com/package/express): ^4.18.2
- [jwt](https://www.npmjs.com/package/jwt): ^0.2.0
- [nodemon](https://www.npmjs.com/package/nodemon): ^2.0.22
- [prisma](https://www.prisma.io/): ^5.3.1
- [nodemailer](https://www.npmjs.com/package/nodemailer): ^6.9.5

