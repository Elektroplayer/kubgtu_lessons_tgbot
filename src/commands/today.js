import Command from "../structures/Command.js";
// import { anotherDay, instKeyboard, kursKeyboard, mainKeyboard } from "../lib/utils.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";


export default class TodayCommand extends Command {
    name = ["Расписание на сегодня", "/today", "/today@kubgtu_lessons_bot"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user, msg) {
        if(!user.group) return bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));

        let text = await user.getSchedule();
        
        bot.sendMessage(
            msg.chat.id,
            text,
            {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: user.id !== msg.chat.id
                }
            }
        );

        if(user.count > 20 && user.id == msg.chat.id) {
            let messages = ["Нравится бот? Поддержи рублём!", "Достаточно одно рубля с 70 человек, чтобы бот продолжил работать ещё месяц!", "Обычно закидывают на чай, но сюда закидывают на шаурму и хост)"];

            bot.sendMessage(
                msg.chat.id,
                messages[ Math.floor( Math.random() * messages.length ) ] + "\nqiwi.com/n/ELECTRO303",
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        remove_keyboard: user.id !== msg.chat.id
                    }
                }
            );

            user.count = 0;
        } else user.count++;
    }
}