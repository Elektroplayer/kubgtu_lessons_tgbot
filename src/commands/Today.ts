import { Message } from "node-telegram-bot-api";
import Command from "../structures/Command.js";
import User from "../structures/User.js";
import Cache from "../lib/Cache.js";

export default class TodayCommand extends Command {
    name = ["Расписание на сегодня", "/today", "/today@kubgtu_lessons_bot"];
    sceneName = ["main"];

    async exec(user: User, msg: Message): Promise<void> {
        if(!user.group) {
            Cache.bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));
            return;
        }

        let text;
        let schedule = await user.group.getTextSchedule();
        let events = await user.group.getTextEvents();

        if(!schedule) text = "<b>Расписание не найдено...</b> <i>или что-то пошло не так...</i>";
        else text = schedule;

        if(events) text += `\n\n${events}`;
        
        Cache.bot.sendMessage(
            msg.chat.id,
            text,
            {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: msg.chat.type == "group"
                }
            }
        );

        // if(user.count > 7 && user.id == msg.chat.id) {
        //     console.log(" + донатное сообщение.");

        //     bot.sendMessage(
        //         msg.chat.id,
        //         messages[ Math.floor( Math.random() * messages.length ) ],
        //         {
        //             parse_mode: "HTML",
        //             reply_markup: {
        //                 remove_keyboard: user.id !== msg.chat.id
        //             }
        //         }
        //     );

        //     user.count = 0;
        // } else user.count++;
    }
}