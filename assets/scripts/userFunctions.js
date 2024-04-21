const fs = require('fs')
const db = require('../db/db.json')
const cards = require('../db/images/images.json');
const { profileKeyboard } = require('../keyboard/keyboard');

async function transferCard(bot, msg){
    await bot.sendMessage(msg.chat.id, "Введите название карты:");

    bot.once('message', async (cardMsg) => {
        const cardName = cardMsg.text;
        const recipient = db.find(user => user.username === msg.text);
        const cardIndex = db.find(user => user.username === msg.from.username && user.inventory.includes(cardName));

        if (!recipient) {
            await bot.sendMessage(msg.chat.id, "Такого пользователя нету в базе данных");
        } else if (!cardIndex) {
            await bot.sendMessage(msg.chat.id, "У вас нету такой карты в инвенторе");
        } else {
            cardIndex.inventory.splice(cardIndex.inventory.indexOf(cardName), 1);
            recipient.inventory.push(cardName);
            await bot.sendMessage(msg.chat.id, `Карта "${cardName}" успешно передана пользователю ${recipient.username}`);
        }
    });
}

async function myCards(bot, msg){
    const userInventory = db.find(user => user?.username === msg.from.username)
    if(userInventory.length === 0){
        return await bot.sendMessage(msg.message.chat.id, "У вас нет карт в инвентаре. Попробуйте получить карты сначала.")
    }else{
        for(const card of userInventory?.inventory){
            const keyboard = {
                inline_keyboard: [
                    [{text: "Добавить карту в инвентарь матча", callback_data: "addToMatchInventory"}]
                ],
                resize_keyboard: true
            }
            await bot.sendPhoto(msg.chat.id, card.cardPhoto, { caption: `🦠 ${card.cardName}\n🔮 Редкость: ${card.cardRarity}\nАтака: ${card.cardPower || "Не указана"}\nЗащита: ${card.cardDeffence || "Не указана"}`,
            reply_markup: keyboard })
        }
    }
}

async function refLink(bot, msg) {
    let usedRefLinks = [];
  
    if (msg.from && msg.from.username) {
      if (usedRefLinks.includes(msg.from.username)) {
        return bot.sendMessage(msg.chat.id, "Вы уже использовали ссылку.");
      }
  
      let cleanedUsername = msg.text;
  
      if (!cleanedUsername) {
        console.log("Сообщение не содержит текст, вероятно, оно не введено пользователем.");
        return;
      }
  
      console.log("Имя пользователя для поиска:", cleanedUsername);
  
      let userExists = db.some(user => user.username === cleanedUsername);
  
      console.log("Пользователь найден:", userExists);
  
      if (userExists) {
        let user = db.find(user => user.username === cleanedUsername);
        user.balance += 2000;
        usedRefLinks.push(msg.from.username); // Добавляем имя пользователя в список использованных ссылок
        fs.writeFileSync('./assets/db/db.json', JSON.stringify(db, null, '\t'));
        await bot.sendMessage(msg.chat.id, "Мы передали ему спасибо");
      } else {
        await bot.sendMessage(msg.chat.id, "Такого пользователя не существует");
      }
  
      cleanedUsername = undefined;
    }
  }

async function addCardToMatchInventory(bot, msg){
    let userInventory = cards.find(card => card.cardName === msg.text)
    let user = db.find(user => user.username === msg.message.from.username)
    if(!userInventory && msg.text){
        await bot.sendMessage(msg.message.chat.id, "Такой карты не существует")
    }else{
        await bot.sendMessage(msg.message.chat.id, "карта успешно добавлена в инвентарь")
        user?.matchInventory?.push(userInventory)
        fs.writeFileSync('./assets/db/db.json', JSON.stringify(db, null, '\t'))
    }

}

async function sendProfileData(bot, msg) {
    const filteredUsers = db.filter((user) => user?.username === msg.from.username);
  
    if (filteredUsers.length > 0) {
      const user = filteredUsers[0];
      
        await bot.sendMessage(
          msg.chat.id,
          `Имя пользователя: ${user.username}\nID: ${user.id}\nИмя: ${user.first_name}\nФамилия: ${user.last_name}\nБаланс: ${user.balance}\nРейтинг: ${user.rating}\nИнвентарь: ${user.inventory.length} из ${cards.length}\n`,
          profileKeyboard
        );
    } else {
      await bot.sendMessage(msg.chat.id, "Пользователь не найден.");
    }
  }

  async function myCards(bot, msg) {
    const userInventory = db.find((user) => user?.username === msg.from.username);
  
    if (userInventory.length === 0) {
      return bot.sendMessage(msg.message.chat.id, "У вас нет карт в инвентаре. Попробуйте получить карты сначала.");
    } else {
      for (const card of userInventory?.inventory) {
        const keyboard = {
          inline_keyboard: [
              [{ text: 'Добавить в инвентарь матча', callback_data: 'addToMatchInventory' }],
          ],
          resize_keyboard: true
        };
        await bot.sendPhoto(msg.message.chat.id, card.cardPhoto, {
          caption: `🦠 ${card.cardName}\n🔮 Редкость: ${card.cardRarity}\nАтака: ${card.cardPower || "Не указана"}\nЗащита: ${card.cardDeffence || "Не указана"}`,
          reply_markup: keyboard
        });
    }
    }
  }
module.exports = {
    transferCard: transferCard,
    sendProfileData: sendProfileData,
    myCards: myCards
}