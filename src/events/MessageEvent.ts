import TelegramBot from "node-telegram-bot-api";
import Event from "../structures/Event.js";
import Cache from "../lib/Cache.js";

export default class MessageEvent extends Event {
    name = "message" as BotEvents;

    async exec(msg: TelegramBot.Message): Promise<void> {
        if (!msg.from || !msg.text) return;

        let user = await Cache.getUser(msg.from.id);

        if (!user.scene) user.scene = Cache.scenes.find((s) => s.name == "main");

        let command = user.scene!.commands.find((c) => c.name.includes(msg.text!) );

        if (!command) {
            if (msg.chat.type !== "group") await Cache.bot.sendMessage(msg.chat.id, "Неизвестная команда");
        } else {
            console.log( `${msg.from?.username ?? msg.from?.first_name ?? "Нет ника (?)"}: ${user.group?.name ?? "Не выбрана"}; ${msg.text};` );

            await command.middlewares.filter(mw => mw.type == 0).forEach(async mw => {
                await mw.exec(user, msg);
            });

            await command.exec(user, msg);

            await command.middlewares.filter(mw => mw.type == 1).forEach(async mw => {
                await mw.exec(user, msg);
            });
        }
    }
}