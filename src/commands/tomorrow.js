import Command from "../structures/Command.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";
import { messages } from "../lib/Utils.js";

export default class TomorrowCommand extends Command {
    name = ["Расписание на завтра", "/tomorrow", "/tomorrow@kubgtu_lessons_bot"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user, msg) {
        if(!user.group) return bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));

        let now = new Date();
        let date = new Date( now.getFullYear(), now.getMonth(), now.getDate()+1 );

        let text = await user.getSchedule(date.getDay(), date.getWeek()%2 == 0);
        
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