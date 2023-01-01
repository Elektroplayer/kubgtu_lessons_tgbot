import { Message } from "node-telegram-bot-api";
import Command from "../structures/Command.js";
import User from "../structures/User.js";
import Cache from "../lib/Cache.js";
import { mainKeyboard } from "../lib/Keyboards.js";

export default class TodayCommand extends Command {
    name = ["🛑 Отмена"];
    sceneName = ["settings"];

    async exec(user: User, msg: Message): Promise<void> {
        user.scene = Cache.scenes.find(s => s.name == "main");

        Cache.bot.sendMessage(msg.chat.id, "Возвращаемся...", {
            disable_web_page_preview: true,
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
            }
        });
    }
}