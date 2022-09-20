import Command from "../structures/Command.js";
import { instKeyboard, mainKeyboard } from "../lib/Keyboards.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";

export default class TodayCommand extends Command {
    name = ["/start", "/start@kubgtu_lessons_bot"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    exec(bot, user, msg) {
        let replytext = `Приветствую, ${msg.from.username}\n\n`;

        if(msg.chat.id == user.id) {
            if(!user.inst_id || !user.group || !user.kurs) {
                replytext += "У тебя не установлена некоторая важная для меня информация. Подскажи пожалуйста,\n\nКакой у тебя институт. Если твоего тут нет, значит он появится в будущем";
    
                bot.sendMessage(msg.chat.id, replytext, {
                    reply_markup: {
                        inline_keyboard: instKeyboard,
                        resize_keyboard: true,
                    }
                });
    
            } else {
                replytext += "Поддержка: @Elektroplayer_xXx\nДонат: qiwi.com/n/ELECTRO303\nGitHub: github.com/Elektroplayer/kubgtu_lessons_tgbot\n\nМожешь выбрать действие снизу.";
    
                bot.sendMessage(msg.chat.id, replytext, {
                    reply_markup: {
                        keyboard: mainKeyboard,
                        resize_keyboard: true,
                    }
                });
            }
        } else {
            if(!user.inst_id || !user.group || !user.kurs) {
                replytext += "Конкретно у тебя не установлена некоторая важная для меня информация. Давай поговорим в личных сообщениях.";
    
                bot.sendMessage(msg.chat.id, replytext);
            } else {
                replytext += "Можешь воспользоваться командами снизу:\n\n/today - Расписание на сегодня\n/tomorrow - Расписание на завтра\n\nПоддержка: @Elektroplayer_xXx\nДонат: qiwi.com/n/ELECTRO303\nGitHub: github.com/Elektroplayer/kubgtu_lessons_tgbot";
    
                bot.sendMessage(msg.chat.id, replytext);
            }
        }
    }
}