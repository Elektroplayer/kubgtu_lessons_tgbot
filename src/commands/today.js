import Command from "../structures/Command.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";
import { messages } from "../lib/Utils.js"; 

export default class TodayCommand extends Command {
    name = ["Расписание на сегодня", "/today", "/today@kubgtu_lessons_bot"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user, msg) {
        if(!user.group) return bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));

        let text;
        let schedule = await user.getSchedule();
        let events = await user.getEvents();

        if(!schedule) text = "<b>Расписание не найдено...</b> <i>или что-то пошло не так...</i>";
        else text = schedule;

        if(events) text += `\n\n${events}`;
        
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

        if(user.count > 7 && user.id == msg.chat.id) {
            console.log(" + донатное сообщение.");

            bot.sendMessage(
                msg.chat.id,
                messages[ Math.floor( Math.random() * messages.length ) ],
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