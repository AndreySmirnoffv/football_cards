require('dotenv').config({ path: "./assets/modules/.env" })
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.devStatus ? process.env.TEST_TOKEN : process.env.DEFAULT_TOKEN, { polling: true })
const fs = require('fs')
const db = require('./assets/db/db.json')
const { startKeyboard, adminKeyboard } = require('./assets/keyboard/keyboard')
const { setAdmin, removeAdmin, askCardDetails } = require('./assets/scripts/adminFunctions')
const { sendProfileData, myCards } = require('./assets/scripts/userFunctions')
const keyboard = require('./assets/keyboard/keyboard')
const { manageRoom } = require('./assets/scripts/matchFunctions')
const { giveRandomCardToUser } = require('./assets/scripts/getCard')
const commands = JSON.parse(fs.readFileSync('./assets/db/commands/commands.json'))
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
bot.setMyCommands(commands)


bot.on('message', async msg => {
    const username = msg.from.username
    let user = await prisma.user.findFirst({
        where: { username }
    })
    if (msg.text === '/start') {
        if (!user) {
            await prisma.user.create({
                data: {
                    id: msg.from.id,
                    username: msg.from.username,
                    first_name: msg.from.first_name,
                    last_name: msg.from.last_name,
                    balance: 0,
                    rating: 0,
                    inventory: JSON.stringify([]),
                    matchInventory: JSON.stringify([]),
                    isAdmin: false,
                    isWaiting: false,
                    isMatch: false,
                    wonMatches: 0,
                    looseMatches: 0,
                    lastActionTime: 0
                }
            })
        } else {
            const isAdminMessage = user.isAdmin ? "Вы админ!" : "";
            await bot.sendMessage(msg.chat.id, `Привет ${username}. ${isAdminMessage}`, user?.isAdmin ? adminKeyboard : startKeyboard);
        }
    } else if (msg.text === 'Личный профиль') {
        sendProfileData(bot, msg)
    } else if (msg.text === "Получить карточку") {
        giveRandomCardToUser(bot, msg)
    } else {
        const adminMessage = user.isAdmin ? `${username} Вы админ вот что вы можете сделать` : ""
        await bot.sendMessage(msg.chat.id, adminMessage, startKeyboard)
    }
})

bot.on('callback_query', async msg => {
    if (msg.data === 'add_card') {
        askCardDetails(bot, msg)
    } else if (msg.data === 'set_admin') {
        setAdmin(bot, msg)
    } else if (msg.data === 'remove_admin') {
        removeAdmin(bot, msg)
    } else if (msg.data === 'mycards') {
        myCards(bot, msg)
    } else if (msg.data === 'startmatch') {
        manageRoom(bot, msg)
    }
})

bot.on('polling_error', console.log)

module.exports = {
    prisma
}