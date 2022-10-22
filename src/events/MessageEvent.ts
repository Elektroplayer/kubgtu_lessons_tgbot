import TelegramBot from "node-telegram-bot-api";
import Event from "../structures/Event.js"
import Main from "../structures/Main.js";

export default class MessageEvent extends Event {
    name = "message" as BotEvents;

    async exec(main:Main, msg:TelegramBot.Message): Promise<void> {
        if(!msg.from || !msg.text) return;

        let user = await main.getUser(msg.from.id);

        if(!user.scene) user.scene = main.scenes.find(s => s.name == "main")

        let command = user.scene!.commands.find(c => c.name.includes(msg.text!))

        if(!command) {
            if(msg.chat.type !== 'group') main.bot.sendMessage(msg.chat.id, "А нафиг сходить?");
        }
        else command.exec(main, user, msg);
    }
}

