import { CallbackQuery } from "node-telegram-bot-api";
import { mainKeyboard } from "../../lib/Keyboards.js";
import Main from "../../structures/Main.js";
import Query from "../../structures/Query.js";
import User from "../../structures/User.js";

export default class KursQuery extends Query {
    name = ["settings_group"];
    sceneName = "register";

    async exec(main: Main, user: User, query: CallbackQuery): Promise<void> {
        if(!query?.message?.text) return; // не знаю как, но на всякий случай

        let db = user.dataBuffer.find(db => db.id == query.message?.message_id);

        if(!db) {
            main.bot.sendMessage(query.message!.chat.id, "Похоже эта кнопка себя исчерпала");
            return;
        }
        
        let group = query.data!.slice(15,query.data!.length);
        user.updateData({
            instId: db.inst_id!,
            kurs: db.kurs!,
            group
        });

        user.scene = main.scenes.find(s => s.name == "main");
        user.dataBuffer = user.dataBuffer.slice(user.dataBuffer.indexOf(db), 1);
        
        main.bot.editMessageText(
            "Вся нужная информация была введена, теперь ты можешь смотреть расписание",
            {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
            }
        );

        main.bot.sendMessage(user.id, "Выберете, что вам нужно на клавиатуре", {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
            }
        });
    }
}