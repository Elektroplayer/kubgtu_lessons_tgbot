import TelegramBot from "node-telegram-bot-api";
import Event from "../structures/Event.js"
import Main from "../structures/Main.js";

export default class MessageEvent extends Event {
    name = "callback_query" as BotEvents;

    async exec(main:Main, query:TelegramBot.CallbackQuery): Promise<void> {
        if(!query.data) return;

        let user = await main.getUser(query.from.id);

        if(!user.scene) user.scene = main.scenes.find(s => s.name == "main");

        let execQuery = user.scene!.queryes.find(q => q.name.some(n => query.data?.startsWith(n)))

        if(!execQuery) main.bot.sendMessage(query.message!.chat.id, "Похоже эта кнопка себя исчерпала");
        else execQuery.exec(main, user, query);
    }
}

