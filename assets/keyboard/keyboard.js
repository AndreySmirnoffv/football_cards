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
            inline_keyboard: [
                [{text: "Добавить карту", callback_data: "add_card"}],
                [{text: "Добавить админа", callback_data: "set_admin"}],
                [{text: "Удалить админа", callback_data: "remove_admin"}],
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