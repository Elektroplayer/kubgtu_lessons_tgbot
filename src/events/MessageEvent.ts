import TelegramBot from "node-telegram-bot-api";
import Event from "../structures/Event.js"
import Cache from "../lib/Cache.js";

export default class MessageEvent extends Event {
    name = "message" as BotEvents;

    async exec(msg:TelegramBot.Message): Promise<void> {
        if(!msg.from || !msg.text) return;

        let user = await Cache.getUser(msg.from.id);

        if(!user.scene) user.scene = Cache.scenes.find(s => s.name == "main")

        let command = user.scene!.commands.find(c => c.name.includes(msg.text!))

        if(!command) {
            if(msg.chat.type !== 'group') Cache.bot.sendMessage(msg.chat.id, "Неизвестная команда");
        }
        else command.exec(user, msg);
    }
}

