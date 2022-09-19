import Event from "../structures/Event.js";
import { days, daysEven } from "../lib/Utils.js";
import { mainKeyboard } from "../lib/Keyboards.js";

export default class CommandActivatorEvent extends Event {
    name = "message";

    async exec(msg) {
        let user = await this.main.getUser(msg.from.id);

        if(days.includes(msg.text) || daysEven.includes(msg.text)) {
            let command = this.main.commands.find(elm => elm.name == "Выбрать другой день");
            return command.choose(this.main.bot, user, msg);
        }

        let command = this.main.commands.find(elm => elm.name == msg.text || elm.name.includes(msg.text));
        if(command) command.exec(this.main.bot, user, msg);
        else this.main.bot.sendMessage(msg.chat.id, "Не понял тебя, повтори набор.", {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
            }
        });
    }
}