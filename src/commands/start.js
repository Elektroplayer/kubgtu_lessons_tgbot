import Command from "../structures/Command.js";
import { instKeyboard, mainKeyboard } from "../lib/Keyboards.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";

export default class TodayCommand extends Command {
    name = "/start";
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    exec(bot, user, msg) {
        let replytext = `Приветствую, ${msg.from.username}\n\n`;

        if(!user.inst_id || !user.group || !user.kurs) {
            replytext += "У тебя не установлена некоторая важная для меня информация. Подскажи пожалуйста,\n\nКакой у тебя институт. Если твоего тут нет, значит он появится в будущем";

            bot.sendMessage(user.id, replytext, {
                reply_markup: {
                    inline_keyboard: instKeyboard,
                    resize_keyboard: true,
                }
            });

        } else {
            replytext += "Можешь выбрать действие снизу.";

            bot.sendMessage(user.id, replytext, {
                reply_markup: {
                    keyboard: mainKeyboard,
                    resize_keyboard: true,
                }
            });
        }
    }
}