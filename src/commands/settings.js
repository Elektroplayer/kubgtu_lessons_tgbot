import Command from "../structures/Command.js";
import { instKeyboard } from "../lib/Keyboards.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";

export default class TodayCommand extends Command {
    name = "/settings";
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    exec(bot, user, msg) {
        let replytext = `Приветствую, ${msg.from.username}\n\n`;

        replytext += "Ты включил перенастройку бота.\n\nКакой у тебя институт. Если твоего тут нет, значит он появится в будущем";

        bot.sendMessage(user.id, replytext, {
            reply_markup: {
                inline_keyboard: instKeyboard,
                resize_keyboard: true,
            }
        });
    }
}