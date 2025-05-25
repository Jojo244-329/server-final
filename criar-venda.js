
const fetch = require('node-fetch');

export default async function handler(req, res) {
    // CORS para permitir chamadas do front-end
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // responde ao preflight
    }

    if (req.method === 'GET') {
        return res.status(200).json({ message: '✅ API online e pronta!' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const publicKey = 'pk_4tMiRh4m3KriLpTGGtmE-zb9bLbNX5lJ6wNpVdMEMmX6m1Xy';
    const secretKey = 'sk_AwTOzgllckqhjiOAoEyeCYnjGmTkmg2l7fScCJ_4wUER4RAQ';
    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    // Aqui você mantém os dados vindos do front-end intactos:
    const payload = {
    paymentMethod: 'pix',
    amount: req.body.amount,
    items: req.body.items,
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
        res.status(200).json(data);
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        res.status(500).json({
            error: 'Erro no servidor ao conectar com ZazzyPay',
            details: error.message
        });
    }
}
