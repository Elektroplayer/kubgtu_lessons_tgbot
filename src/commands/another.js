import Command from "../structures/Command.js";
import { anotherDay, mainKeyboard } from "../lib/Keyboards.js";
import { days, daysEven } from "../lib/Utils.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";


export default class TodayCommand extends Command {
    name = ["Выбрать другой день"];

    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user, msg) {
        if(msg.chat.id !== user.id) return;
        
        if(!user.group) return bot.sendMessage(user.id, "У меня нет данных о тебе. Напиши /start");
        
        bot.sendMessage(
            user.id,
            "Выбери дату",
            {
                reply_markup: {
                    keyboard: anotherDay,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        );
    }

    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async choose(bot, user, msg) {
        if(!user.group) return bot.sendMessage(user.id, "У меня нет данных о тебе. Напиши /start");

        let text;
        let incorrect;

        if(days.includes(msg.text)) text = await user.getSchedule(days.indexOf(msg.text)+1, false);
        else if(daysEven.includes(msg.text)) text = await user.getSchedule(daysEven.indexOf(msg.text)+1, true);
        else {
            text = "Не понял тебя, повтори набор.";
            incorrect = true;
        }

        bot.sendMessage(
            user.id,
            text,
            {
                parse_mode: "HTML",
                reply_markup: incorrect ? {
                    keyboard: anotherDay,
                    resize_keyboard: true,
                    one_time_keyboard: true
                } : {
                    keyboard: mainKeyboard,
                    resize_keyboard: true,
                }
            }
        );
    }
}