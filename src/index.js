import { config } from "dotenv";
import mongoose from "mongoose";
import Main from "./structures/Main.js";

config(); // Инициализируем .env конфиг
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

let main = new Main();

main.loadCommands();
main.loadEvents();