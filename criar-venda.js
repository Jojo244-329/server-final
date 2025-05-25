const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const serverless = require('serverless-http');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/criar-venda', async (req, res) => {
    const publicKey = 'pk_4tMiRh4m3KriLpTGGtmE-zb9bLbNX5lJ6wNpVdMEMmX6m1Xy';
    const secretKey = 'sk_AwTOzgllckqhjiOAoEyeCYnjGmTkmg2l7fScCJ_4wUER4RAQ';
    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const payload = {
        paymentMethod: 'pix',
        amount: req.body.amount || 8500,
        items: req.body.items || [{
            title: 'pagamento pix',
            unitPrice: req.body.amount || 8500,
            quantity: 1,
            tangible: false
        }],
        customer: req.body.customer
    };

    try {
        const response = await fetch('https://api.zazzipay.com/v1/transactions', {
            method: 'POST',
            headers: {
                Authorization: auth,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Erro da API ZazzyPay:', data);
            return res.status(response.status).json(data);
        }

        console.log('✅ Resposta da ZazzyPay:', data);
        res.json(data);
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        res.status(500).json({
            error: 'Erro no servidor ao conectar com ZazzyPay',
            details: error.message
        });
    }
});

// ⚠️ Exporta como função para Vercel, sem app.listen
module.exports = app;
module.exports.handler = serverless(app);
