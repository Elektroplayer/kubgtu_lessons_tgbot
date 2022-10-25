import Parser from "./Parser.js";
import Schedules from "../models/Schedules.js";

export default class Group {
    name: string;
    kurs: number;
    instId: number;
    parser: Parser;
    schedule?: Schedule;

    constructor(name: string, kurs: number, instId: number) {
        this.name    = name;
        this.kurs    = kurs;
        this.instId  = instId;
        this.parser  = new Parser(instId, kurs, name);
    }

    async getTextSchedule(day = new Date().getDay(), week = new Date().getWeek()%2==0) {
        let out   = "";

        if(!this.schedule || new Date().valueOf() - this.schedule.updateDate?.valueOf()! > 1000 * 60 * 60 * 24) {
            let r = await this.updateSchedule();
            if(r == null) return "<b>Произошла ошибка<b>\nСкорее всего сайт с расписанием не работает..."
        }

        let daySchedule = this.schedule!.days.find(elm => elm.daynum == day && elm.even == week)?.daySchedule ?? [];

        daySchedule.forEach(elm => {
            out += `\n\n${elm.number} пара: ${elm.name} [${elm.paraType}]\n  Время: ${elm.time}`;
            if(elm.teacher) out += `\n  Преподаватель: ${elm.teacher}`;
            if(elm.auditory) out += `\n  Аудитория: ${elm.auditory}`;
            if(elm.percent) out += `\n  Процент группы: ${elm.percent}`;
            if(elm.flow) out += "\n  В лекционном потоке";
            if(elm.remark) out += `\n  Примечание: ${elm.remark}`;
        });

        return `<b>${this.parser.days[day]} / ${week ? "Чётная" : "Нечётная"} неделя</b>` + (!out ? "\nПар нет! Передохни:з" : out);
    }

    /**
     * Устанавливает новое расписание
     */
    setSchedule(days: Day[], updateDate = new Date()) {
        this.schedule = { updateDate, days };

        return this.schedule;
    }

    /**
     * Ищет расписание.
     * Если оно есть в БД и оно не устарело, устанавливает его.
     * Если оно есть в БД, но оно устарело, парсит информацию с сайта (при этом если сайт не работает, даёт что есть) и обновляет расписание в БД.
     * Если записи в БД нет, парсит расписание и создаёт запись в БД.
     * Если сайт не работает и в БД записей нет, выдаёт null.
     */
    async updateSchedule() {
        let dbResponse = await Schedules.findOne({group: this.name}).exec()

        if(dbResponse) {
            if(new Date().valueOf() - dbResponse?.updateDate?.valueOf()! < 1000 * 60 * 60 * 24) return this.setSchedule(dbResponse.days as Day[], dbResponse.updateDate!)
            else {
                try {
                    let days = await this.parser.parseSchedule();

                    dbResponse.days = days;
                    dbResponse.updateDate = new Date();
                    dbResponse.save().catch(console.log);

                    return this.setSchedule(days);
                } catch (error) {
                    return this.setSchedule(dbResponse.days as Day[], dbResponse.updateDate!)
                }
            }
        } else {
            try {
                let days = await this.parser.parseSchedule()

                new Schedules({
                    group: this.name,
                    days,
                    updateDate: new Date()
                }).save().catch(console.log);

                return this.setSchedule(days);
            } catch (error) {
                return null
            }
        }
    }

    async updateScheduleFromSite() {
        try {
            let days = await this.parser.parseSchedule()

            let dbResponse = await Schedules.findOne({group: this.name}).exec()

            if(dbResponse) {
                dbResponse.days = days;
                dbResponse.updateDate = new Date();

                dbResponse.save().catch(console.log)
            } else {
                new Schedules({
                    group: this.name,
                    days,
                    updateDate: new Date()
                }).save().catch(console.log);
            }

            return this.setSchedule(days);
        } catch (error) {
            return null
        }
    }
}