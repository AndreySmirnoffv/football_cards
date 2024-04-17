module.exports = {
    startKeyboard: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: "Личный профиль", callback_data: "profile"}],
                [{text: "Начать матч", callback_data: "startmatch"}],
                [{text: "Получить карточку", callback_data: "getcard"}],
                [{text: "Передать карту пользователю", callback_data: "transfercard"}]
                [{text: "Посмотреть свои карты", callback_data: "mycards"}]
            ]
        })
    },
    adminKeyboard: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: "Добавить карту", callback_data: "add_card"}],
                [{text: "Добавить админа", callback_data: "set_admin"}],
                [{text: "Удалить админа", callback_data: "remove_admin"}]
            ]
        })
    }
}