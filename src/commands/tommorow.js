import Command from "../structures/Command.js";
// import { anotherDay, instKeyboard, kursKeyboard, mainKeyboard } from "../lib/utils.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";


export default class TodayCommand extends Command {
    name = "Расписание на завтра";
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg 
     */
    async exec(bot, user) {
        if(!user.lessons) return bot.sendMessage(user.id, "У меня нет данных о тебе. Напиши /start");

        let now = new Date();
        let date = new Date( now.getFullYear(), now.getMonth(), now.getDate()+1 );

        let text = await user.lessons.getLessons(date.getDay(), date.getWeek()%2 == 0);
        
        bot.sendMessage(
            user.id,
            text,
            {
                parse_mode: "HTML"
            }
        );
    }
}