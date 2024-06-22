require('dotenv').config({path: "../modules/.env"})
const {API} = require('yoomoney-sdk')
const api = new API(process.env.YOOMONEY_TOKEN)

async function createPayment(){
    const response = await api.requestPayment({
        pattern_id: "p2p", 
        to: process.env.WALLET_NUM, 
        amount: 300, 
        amount_due: "сколько должен заплатить пользователь с учетом комиссии",
        comment: "Спасибо за покупку", 
        message: "Дрочер оплатил подписку", 
    })
    console.log(response)
}

createPayment()