import Event from "../structures/Event.js";
import { days, daysEven } from "../lib/Utils.js";
import { mainKeyboard } from "../lib/Keyboards.js";
// eslint-disable-next-line no-unused-vars
import TelegramBot from "node-telegram-bot-api";

export default class CommandActivatorEvent extends Event {
    name = "message";

    /**
     * @param {TelegramBot.Message} msg 
     */
    async exec(msg) {
        let user = await this.main.getUser(msg.from.id);

        if(days.includes(msg.text) || daysEven.includes(msg.text)) {
            let command = this.main.commands.find(elm => elm.name == "Выбрать другой день");
            return command.choose(this.main.bot, user, msg);
        }

        let command = this.main.commands.find(elm => elm.name?.some(text => msg.text?.startsWith(text)));
        if(command) {
            console.log( `${msg.from.username ?? msg.from.first_name ?? "Нет ника (?)"}: ${user.group ?? "Не выбрана"}; ${msg.text};` );

            if(command.name[0] == "/adm") command.exec(this.main.bot, user, msg, this.main);
            else command.exec(this.main.bot, user, msg);
        }
        else if(msg.from.id == msg.chat.id) this.main.bot.sendMessage(msg.chat.id, "Не понял тебя, повтори набор.", {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
            }
        });
    }
}