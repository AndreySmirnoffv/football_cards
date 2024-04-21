module.exports = {
    startKeyboard: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: "Личный профиль"}],
                [{text: "Получить карточку"}],
            ],
            resize_keyboard: true
        })
    },
    adminKeyboard: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: "Добавить карту"}],
                [{text: "Добавить админа"}],
                [{text: "Удалить админа"}]
            ],
            resize_keyboard: true
        })
    },
    profileKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Начать матч", callback_data: "startmatch"}],
                [{text: "Передать карту пользователю", callback_data: "transfercard"}],
                [{text: "Посмотреть свои карты", callback_data: "mycards"}]
            ],
            resize_keyboard: true
        })
    }
}