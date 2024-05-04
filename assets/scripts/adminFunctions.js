const fs = require('fs')
const db = require('../db/db.json')
const cards = require('../db/images/images.json')

async function setAdmin(bot, msg){
    let admin = db.find(user => user.isAdmin === msg.text)
    if(!admin){
        await bot.sendMessage(msg.chat.id, "Такого пользователя нету в базе данных!")
        return;
    }
    admin.isAdmin = true
    fs.writeFileSync('./assets/db/db.json', JSON.stringify(db, null, '\t'))
    await bot.sendMessage(msg.chat.id, "юзер с именем @" + msg.text + " теперь админ")
}

async function removeAdmin(bot, msg){
    const admin = db.find(user => user.isAdmin === msg.text)
    if(!user){
        await bot.sendMessage(msg.chat.id, "Такого пользователя нету в базе данных")
        return;
    }
    admin.isAdmin = false
    fs.writeFileSync('./assets/db/db.json', JSON.stringify(db, null, '\t'))
    await bot.sendMessage(msg.chat.id, "Пользователь с именем @" + msg.text + " больше не админ")

}

async function waitForText(bot, chatId) {
  return new Promise((resolve) => {
    bot.onText(/.*/, (msg) => {
      if (msg.from.username === chatId) {
        resolve(msg);
        console.log(msg.text)
      }
    });
  });
}

async function waitForPhoto(bot, chatId) {
  return new Promise((resolve) => {
    bot.on("photo", (msg) => {
      if (msg.from.username === chatId) {
        resolve(msg);
        console.log(msg.fileId)
      }
    });
  });
}

function saveToJson(data) {
  const jsonData = JSON.stringify(data, null, "\t");
  fs.writeFileSync('./assets/db/images/images.json', jsonData);
}

async function askCardDetails(bot, msg) {
    try {
      await bot.sendMessage(msg.message.chat.id, "Введите название карты:");
      const cardNameMessage = await waitForText(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Прикрепите фото карты:");
      const cardPhotoMessage = await waitForPhoto(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Введите силу карты:");
      const cardPowerMessage = await waitForText(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Введите раздел карты:");
      const cardSectionMessage = await waitForText(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Введите редкость карты");
      const cardRarityMessage = await waitForText(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Введите шанс выпадения карты");
      const cardDropChance = await waitForText(bot, msg.from.username);
  
      await bot.sendMessage(msg.message.chat.id, "Введите силу защиты карты")
      const cardDeffence = await waitForText(bot, msg.from.username)
  
      let cardDetails = {
        cardName: cardNameMessage.text,
        cardPhoto: cardPhotoMessage.photo[0].file_id,
        cardPower: parseInt(cardPowerMessage.text),
        cardSection: cardSectionMessage.text,
        cardRarity: cardRarityMessage.text,
        cardDropChance: cardDropChance.text,
        cardDeffence: cardDeffence.text
      };
  
      cards.push(cardDetails);
      saveToJson(cards);
      bot.sendMessage(
        msg.message.chat.id,
        "Карта успешно добавлена в базу данных!"
      );
    } catch (error) {
      return;
    }
  }
  

module.exports = {
    setAdmin: setAdmin,
    removeAdmin: removeAdmin,
    askCardDetails: askCardDetails
}