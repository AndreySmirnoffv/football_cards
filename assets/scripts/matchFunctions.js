const db = require('../db/db.json')
const fs = require('fs')



function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


async function playRound(player1, player2) {
  const action1 = getRandomElement(player1.matchInventory); 
  const action2 = getRandomElement(player2.matchInventory); 


  let resultText = '';
  if (action1 === 'goal' && action2 !== 'goal') {
    resultText = `${player1.name} (${action1}) забил гол!`;
  } else if (action2 === 'goal' && action1 !== 'goal') {
    resultText = `${player2.name} (${action2}) забил гол!`;
  } else {
    resultText = 'Ничего не произошло.';
  }


  switch (action1.cardSection) {
    case 'attack':
      resultText += ' Атака.';
      break;
    case 'defense':
      resultText += ' Защита.';
      break;
    case 'midfield':
      resultText += ' Полузащита.';
      break;
    case 'goalkeeper':
      resultText += ' Вратарь.';
      break;
    default:
      resultText += '';
  }

  return resultText;
}

async function playMatch(player1, player2) {
  let winner = null;

  for (let i = 0; i < 3; i++) {
    const roundResult = await playRound(player1, player2);
    console.log('Раунд', i + 1, ':', roundResult);
  }

  return winner;
}

async function manageRoom(bot, msg) {
  try {
    const waitingPlayers = db.filter(player => player.isWaiting);

    if (waitingPlayers.length < 2) {
      await bot.sendMessage(msg.message.chat.id, 'Недостаточно игроков для проведения матча.');
      return;
    }

    const [player1, player2] = waitingPlayers.slice(0, 2);

    player1.isWaiting = false;
    player2.isWaiting = false;
    player1.isMatch = true;
    player2.isMatch = true;

    const winner = await playMatch(player1, player2);

    player1.isMatch = false;
    player2.isMatch = false;

    if (winner) {
      console.log(`Победитель матча: ${winner.username}`);
      await bot.sendMessage(msg.chat.id, `Победитель матча: ${winner.username}`)
      winner.rating += 100
      fs.writeFileSync('./assets/db/db.json', JSON.stringify(db, null, '\t'))
    } else {
      await bot.sendMessage(msg.chat.id, 'Матч завершился вничью.')
    }
  } catch (error) {
    console.error('Произошла ошибка при управлении комнатой:', error);
  }
}



module.exports = {
    manageRoom: manageRoom
}