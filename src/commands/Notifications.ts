import { Message } from "node-telegram-bot-api";
import { instKeyboard, mainKeyboard, settingsKeyboard } from "../lib/Keyboards.js";
import Command from "../structures/Command.js";
import User from "../structures/User.js";
import Cache from "../lib/Cache.js";
import Users from "../models/Users.js";

export default class TodayCommand extends Command {
    name = ["🔔 Включить напоминания", "🔕 Выключить напоминания"];
    sceneName = ["settings"];

    async exec(user: User, msg: Message): Promise<void> {
        let userData = await Users.findOne({userId: user.id}).exec()

        userData!.notifications = msg.text == "🔔 Включить напоминания"
        userData!.save().catch(console.log)

        user.scene = Cache.scenes.find(s => s.name == "main");

        Cache.bot.sendMessage(msg.chat.id, `Напоминания ${ msg.text == "🔔 Включить напоминания" ? "включены" : "выключены"}`, {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
                //one_time_keyboard: true
            }
        });
    }
}