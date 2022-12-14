import Timer from "../structures/Timer.js";
import Users from "../models/Users.js";
import Cache from "../lib/Cache.js";
import { CronJob } from "cron";

export default class TestTimer extends Timer {
    time = 0;

    async init() {
        new CronJob('0 40 9 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 9}); // После первой пары
        new CronJob('0 20 11 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 11}); // второй
        new CronJob('0 20 13 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 12}); // третьей
        new CronJob('0 00 15 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 14}); // четвёртой
        new CronJob('0 40 16 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 16}); // пятой
        new CronJob('0 20 18 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 18}); // шестой
        new CronJob('0 00 20 * * 1-6', this.exec, null, true, 'Europe/Moscow', {time: 19}); // и даже седьмой
    }

    async exec() {
        let usersID = await Users.find({notifications: true}).exec()
        
        let dateToday = new Date();
        let dateTomorrow = new Date();
        dateTomorrow.setUTCDate(dateTomorrow.getUTCDate() + 1);

        console.log('--------- Начинаю отправлять уведомления ---------');

        usersID.forEach(async (elm) => {
            let user = await Cache.getUser(+elm.userId!); // Ищем юзера

            if(!user.group) return; // Если нету группы - забиваем

            let text;
            let todayScheduleArray = await user.group.getRawSchedule(dateToday.getDay(), dateToday.getWeek()%2==0); // Смотрим сегодняшнее расписание

            // Забиваем если
            if(todayScheduleArray == null) return; // ...расписания нет вообще.

            if(todayScheduleArray.length == 0) {
                if(this.time != 9) return // ...расписания нет, а время уже не 9
            } else if(this.time != +todayScheduleArray[todayScheduleArray.length-1].time.split(":")[1].split(" - ")[1]) return; // ...ещё не время (отправляем только, после пар)

            console.log(`${user.id}, ${user.group?.name}`)

            text = await user.group.getTextSchedule(dateTomorrow.getDay(), dateTomorrow.getWeek()%2==0);

            let events = await user.group.getTextEvents(dateTomorrow);
            if(events) text += `\n\n${events}`;
            
            Cache.bot.sendMessage(
                user.id,
                text,
                {parse_mode: "HTML"}
            );
        });
        // console.log(usersID);
    }
}