import { Message } from "node-telegram-bot-api";
import Command from "../structures/Command.js";
import User from "../structures/User.js";
import Cache from "../lib/Cache.js";

export default class NearestCommand extends Command {
    name = ["⏩ Ближайшее", "/nearest", "/nearest@kubgtu_lessons_bot"];
    sceneName = ["main"];

    async exec(user: User, msg: Message): Promise<void> {
        if(!user.group) {
            Cache.bot.sendMessage(msg.chat.id, "У меня нет данных о тебе. Напиши /start" + ( msg.chat.id !== user.id ? " мне личные сообщения." : "."));
            return;
        }

        let date = new Date();

        let schedule, events;
        for(let i=0;i<=14;i++) {
            date.setUTCDate(date.getUTCDate() + 1);

            schedule = await user.group.getTextSchedule(date.getDay(), date.getWeek()%2==0);
            events = await user.group.getTextEvents(date);

            if(schedule.indexOf("Пар нет! Передохни:з") == -1 || events) break;
        }
        
        let text = schedule && schedule.indexOf("Пар нет! Передохни:з") == -1 ? schedule : "<b>Ближайшего расписания не найдено...</b> <i>или что-то пошло не так...</i>";

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