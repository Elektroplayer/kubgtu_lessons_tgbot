import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import UserStructure from "./structures/User.js";
import { readdirSync } from "fs";
// eslint-disable-next-line no-unused-vars
import Command from "./structures/Command.js";
import { kursKeyboard, mainKeyboard } from "./lib/Keyboards.js";
import mongoose from "mongoose";
import { days, daysEven } from "./lib/Utils.js";
import https from "https";
import fetch from "node-fetch";

config(); // Инициализируем .env конфиг
const bot = new TelegramBot(process.env.TOKEN, {polling: true}); // Инициализируем бота
mongoose.connect(process.env.MONGO_URI); // Подключаем MongoDB

// Сделано для определения чётности недели
// Returns the ISO week of the date.
// Source: https://weeknumber.net/how-to/javascript
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

/**
 * @type {UserStructure[]}
 */
let users = [];

const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Возвращает пользователя. Если его нет, создаёт и добавляет его в массив.
 * @param {string} userId 
 * @returns {UserStructure}
 */
async function getUser(userId) {
    let user = users.find(u => u.id == userId);

    if(!user) {
        user = new UserStructure(userId);
        await user.getData();

        users.push(user);
    }

    return user;
}

async function groupsParser(inst_id, kurs) {
    let url = `https://elkaf.kubstu.ru/timetable/default/time-table-student-ofo?iskiosk=0&fak_id=${inst_id}&kurs=${kurs}&ugod=${new Date().getFullYear()}`;

    let res = await fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        },
        agent
    });

    let text = await res.text();
    // let root = parse(text);

    let matches = text.match(/<option.+<\/option>/g);
    matches = matches.slice( matches.indexOf("<option value=\"\">Выберите группу</option>")+1, matches.length )
        .map(elm => {
            let r = elm.substring(elm.indexOf(">")+1, elm.length);
            r = r.substring(0, r.indexOf("<"));
            return r;
        });

    console.log(matches);
    return matches;
}

/**
 * @type {Command[]}
 */
let commands = []; // Массив с командами

// Загрузка команд
for (let dirent of readdirSync("./src/commands/", {withFileTypes: true})) {
    if (!dirent.name.endsWith(".js")) continue;

    let commandClass = (await import("./commands/" + dirent.name)).default;
    let command = new commandClass();
    commands.push(command);
}

// Для дебага
bot.on("polling_error", console.log);

// Активация команд
bot.on("message", async (msg) => {
    let user = await getUser(msg.from.id);

    if(days.includes(msg.text) || daysEven.includes(msg.text)) {
        let command = commands.find(elm => elm.name == "Выбрать другой день");
        return command.choose(bot, user, msg);
    }

    let command = commands.find(elm => elm.name == msg.text);
    if(command) command.exec(bot, user, msg);
    else bot.sendMessage(user.id, "Не понял тебя, повтори набор.", {
        reply_markup: {
            keyboard: mainKeyboard,
            resize_keyboard: true,
        }
    });
    
});

// Всё это используется для настройки
bot.on("callback_query", async (query) => {
    let user = await getUser(query.from.id);
    let text = query.message.text;

    if(query.data.startsWith("settings_inst")) {
        user.inst_id = query.data.slice(14,query.data.length);

        return bot.editMessageText(
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

        let groups = await groupsParser(user.inst_id, user.kurs);

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
        buffer = [];

        bot.editMessageText(
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
        
        bot.editMessageText(
            "Вся нужная информация была введена, теперь ты можешь смотреть расписание",
            {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
            }
        );

        bot.sendMessage(user.id, "Выберете, что вам нужно на клавиатуре", {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true
            }
        });
    }
});