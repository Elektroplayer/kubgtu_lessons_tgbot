import { Message } from "node-telegram-bot-api";
import { instKeyboard } from "../../lib/Keyboards.js";
import Users from "../../models/Users.js";
import Command from "../../structures/Command.js";
import User from "../../structures/User.js";
import Cache from "../../lib/Cache.js";

export default class TodayCommand extends Command {
    name = ["/start"];
    sceneName = [];

    async exec(user: User, msg: Message): Promise<void> {
        let replytext = `Приветствую, ${msg.from!.username}\n\n`;
        // let userData = await Users.findOne({userId: user.id}).exec()

        if(!user.group) {

            user.scene = Cache.scenes.find(s => s.name == "register")

            replytext += "У тебя не установлена некоторая важная для меня информация. Подскажи пожалуйста,\n\nКакой у тебя институт. Если твоего тут нет, значит он может появиться в будущем";

            Cache.bot.sendMessage(msg.chat.id, replytext, {
                reply_markup: {
                    inline_keyboard: instKeyboard,
                    resize_keyboard: true,
                }
            });


            // replytext += "Поддержка: @Elektroplayer_xXx\nДонат: qiwi.com/n/ELECTRO303\nGitHub: github.com/Elektroplayer/kubgtu_lessons_tgbot\n\nМожешь выбрать действие снизу.";

            // bot.sendMessage(msg.chat.id, replytext, {
            //     disable_web_page_preview: true,
            //     reply_markup: {
            //         keyboard: mainKeyboard,
            //         resize_keyboard: true,
            //     }
            // });
            
        }
    }
}