import Command from "../structures/Command.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";

export default class TomorrowCommand extends Command {
    name = ["/update", "/update@kubgtu_lessons_bot"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user, msg) {
        if(!user.group) return bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));

        user.groupClass.getDbResponse(true);
        
        bot.sendMessage(
            msg.chat.id,
            "Расписание обновлено принудительно!",
            {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: user.id !== msg.chat.id
                }
            }
        );
    }
}