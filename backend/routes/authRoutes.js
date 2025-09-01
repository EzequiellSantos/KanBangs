const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken")
const router = express.Router();
const secret = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(12)
    const passwordhash = await bcrypt.hash(password, salt)
    try {

        const newUser = await User.create({
            email,
            password: passwordhash,
            firstName,
            lastName,
            provider: 'local'
        });

        //criando token
        const token = jwt.sign(

            //payload
            {
                user: newUser.user,
                id: newUser._id
            },
            secret

        )

        res.json({ error: null, msg: "Eai DEV, você realizou o cadastro com sucesso!", token: token, userId: newUser._id})

  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
});

router.post("/login", async (req, res) => {

    const email = req.body.email
    const password = req.body.password

    const userIsPresent = await User.findOne({ email: email })

    if(!userIsPresent){
        return res.status(400).json({
            error: "Não há usuário cadastro com este nome!"
        })
    }

    //  verificar se a senha está correta
    const checkPassword = await bcrypt.compare(password, userIsPresent.password)

    if (!checkPassword){
        return res.status(400).json({
            error: "Senha Inválida!"
        })
    }

    // criar token
    const token = jwt.sign(

        //payload
        {
            user: userIsPresent.user,
            id: userIsPresent._id,
        },
        secret

    )

    res.json({
        error: null, msg:"Você está autenticado!", token: token, userId: userIsPresent._id
    })

})

router.post('/oauth', async (req, res) => {
  const { email, provider, providerId, firstName, lastName } = req.body;

  try {
    let user = await User.findOne({ email });

    // Se já existe, apenas retorne o mesmo usuário
    if (!user) {
      user = await User.create({ email, provider, providerId, firstName, lastName });
    } else {
      // Atualiza provider info se necessário
      user.provider = provider;
      user.providerId = providerId;
      await user.save();
    }

    const token = jwt.sign(
      {
        user: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      error: null,
      msg: "Você está autenticado!",
      token,
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao autenticar via OAuth',
      errorMessage: err.message
    });
  }
});


module.exports = router;
