import { Message } from "node-telegram-bot-api";
import Command from "../structures/Command.js";
import User from "../structures/User.js";
import Cache from "../lib/Cache.js";
import { settingsKeyboard } from "../lib/Keyboards.js";
import Users from "../models/Users.js";

export default class TodayCommand extends Command {
    name = ["⚙️ Настройки", "/settings", "/settings@kubgtu_lessons_bot"];
    sceneName = ["main"];

    async exec(user: User, msg: Message): Promise<void> {
        if (msg.chat.type == "group") {
            Cache.bot.sendMessage(msg.chat.id, "Настройки доступны только в личных сообщениях.");

            return;
        }

        user.scene = Cache.scenes.find(s => s.name == "settings");

        let userData = await Users.findOne({userId: user.id}).exec()

        Cache.bot.sendMessage(msg.chat.id, "Выбери, что стоит настроить", {
            reply_markup: {
                keyboard: settingsKeyboard(userData?.notifications ?? false),
                remove_keyboard: true,
                resize_keyboard: true
            }
        });

        // let replytext = "Включен режим настройки, укажи заново: \n\nКакой у тебя институт. Если твоего тут нет, значит он может появиться в будущем";

        // Cache.bot.sendMessage(msg.chat.id, replytext, {
        //     disable_web_page_preview: true,
        //     reply_markup: {
        //         inline_keyboard: instKeyboard,
        //         remove_keyboard: true
        //     }
        // });
    }
}