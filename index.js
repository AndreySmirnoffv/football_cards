require('dotenv').config({path: "./assets/modules/.env"})
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot("7189456576:AAGrUOPhlzeA77WEu7iqxBr1rhnOHhsxO2c", {polling: true})
const fs = require('fs')
const db = require('./assets/db/db.json')
const { startKeyboard, adminKeyboard } = require('./assets/keyboard/keyboard')
const { setAdmin, removeAdmin, askCardDetails } = require('./assets/scripts/adminFunctions')
const { sendProfileData, myCards } = require('./assets/scripts/userFunctions')
const commands = JSON.parse(fs.readFileSync('./assets/db/commands/commands.json'))

bot.setMyCommands(commands)

bot.on('message', async msg => {
    let user = db.find(user => user.username === msg.from.username)
    if (msg.text === '/start'){
        if(!user){
            db.push({
                username: msg.from.username,
                inventory: [],
                matchInventory: [],
                isAdmin: false,
                balance: 0,
                rating: null
            })
            fs.writeFileSync('./assets/db/db.json', JSON.stringify (db, null, '\t'))
            await bot.sendMessage(msg.chat.id, `Привет ${msg.from.username} вот что ты можешь сделать`)
        }
    }else if(msg.text === 'Личный профиль'){
        sendProfileData(bot, msg)
    }else{
        const adminMessage = user.isAdmin ? `${msg.from.username} Вы админ вот что вы можете сделать` : ""
        await bot.sendMessage(msg.chat.id, adminMessage, adminKeyboard)
    }
})

bot.on('callback_query', async msg => {
    if (msg.data === 'add_card'){
        askCardDetails(bot, msg)
    }else if(msg.data === 'set_admin'){
        setAdmin(bot, msg)
    }else if(msg.data === 'remove_admin'){
        removeAdmin(bot, msg)
    }else if(msg.data === 'mycards'){
        myCards(bot, msg)
    }
})

bot.on('polling_error', console.log)