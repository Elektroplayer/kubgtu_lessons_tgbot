import Command from "../structures/Command.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line no-unused-vars
import User from "../structures/User.js";
// eslint-disable-next-line no-unused-vars
import Main from "../structures/Main.js";
import Event from "../models/Event.js";

export default class TodayCommand extends Command {
    name = ["/adm"];
    
    /**
     * @param {TelegramBot} bot 
     * @param {User} user 
     * @param {TelegramBot.Message} msg
     * @param {Main} main
     */
    async exec(bot, user, msg, main) {
        if(user.id != "588163528") {
            console.log(user.id);
            return bot.sendMessage(msg.chat.id, "Зря ты это написал... Мои люди уже выехали за тобой, чтобы поговорить...");
        }

        let msgArr = msg.text.split(/\s+/g);

        if(msgArr[1].toLocaleLowerCase() == "updateschedule") {
            let groupClass;
            if(main.groups.find(elm => elm.name == msgArr[2])) groupClass = main.groups.find(elm => elm.name == msgArr[2]);
            else return bot.sendMessage(msg.chat.id, "Не нашёл эту группу");

            groupClass.getDbResponse(msgArr[3]?.toLocaleLowerCase() == "true");

            bot.sendMessage(msg.chat.id, "Ок");
        }

        if(msgArr[1].toLocaleLowerCase() == "clearevents") {

            let events = await Event.find({}).exec();

            events.forEach(ev => {
                if(ev.date < new Date().setUTCHours(0,0,0,0)) Event.deleteMany({date: ev.date});
            });

            bot.sendMessage(msg.chat.id, "Ок");
        }
    }
}