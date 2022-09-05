import Event from "../structures/Event.js";
import https from "https";
import { kursKeyboard, mainKeyboard } from "../lib/Keyboards.js";
import fetch from "node-fetch";

export default class SettingsCallbackEvent extends Event {
    name = "callback_query";

    /**
     * Парсит группы с сайта для данного института и курса и возвращает массив с ними
     * @param {number} inst_id 
     * @param {number} kurs 
     * @returns {string[]}
     */
    async groupsParser(inst_id, kurs) {
        let url = `https://elkaf.kubstu.ru/timetable/default/time-table-student-ofo?iskiosk=0&fak_id=${inst_id}&kurs=${kurs}&ugod=${new Date().getFullYear()}`;
    
        let res = await fetch(url, {
            headers: {
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            },
            agent: new https.Agent({ rejectUnauthorized: false })
        });
    
        let text = await res.text();
    
        let matches = text.match(/<option.+<\/option>/g);
        matches = matches.slice( matches.indexOf("<option value=\"\">Выберите группу</option>")+1, matches.length )
            .map(elm => {
                let r = elm.substring(elm.indexOf(">")+1, elm.length);
                r = r.substring(0, r.indexOf("<"));
                return r;
            });
    
        return matches;
    }

    async exec(query) {
        let user = await this.main.getUser(query.from.id);
        let text = query.message.text;
    
        if(query.data.startsWith("settings_inst")) {
            user.inst_id = query.data.slice(14,query.data.length);
    
            return this.main.bot.editMessageText(
                text.split("\n\n").slice(0,text.split("\n\n").length-1).join("\n\n") + "\n\nВыбери свой курс.",
                {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                    reply_markup: {
                        inline_keyboard: kursKeyboard,
                        resize_keyboard: true,
                    }
                }
            );
        }
    
        if(query.data.startsWith("settings_kurs")) {
            user.kurs = query.data.slice(14,query.data.length);
    
            let groups = await this.groupsParser(user.inst_id, user.kurs);
    
            let keyboard = [];
            let buffer = [];
    
            for(let i = 0;i<groups.length;i++) {
                if(i%4==0 && i!=0) {
                    keyboard.push(buffer);
                    buffer = [];
                }
                buffer.push({
                    text: groups[i],
                    callback_data: "settings_group_"+groups[i]
                });
            }
    
            keyboard.push(buffer);
    
            this.main.bot.editMessageText(
                text.split("\n\n").slice(0,text.split("\n\n").length-1).join("\n\n") + "\n\nВыбери свою группу.",
                {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                    reply_markup: {
                        inline_keyboard: keyboard,
                        resize_keyboard: true
                    }
                }
            );
        }
    
        if(query.data.startsWith("settings_group")) {
            user.group = query.data.slice(15,query.data.length);
            user.updateData();
            
            this.main.bot.editMessageText(
                "Вся нужная информация была введена, теперь ты можешь смотреть расписание",
                {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                }
            );
    
            this.main.bot.sendMessage(user.id, "Выберете, что вам нужно на клавиатуре", {
                reply_markup: {
                    keyboard: mainKeyboard,
                    resize_keyboard: true
                }
            });
        }
    }
}