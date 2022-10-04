import Event from "../models/Event.js";
import Users from "../models/Users.js";
import Group from "./Group.js";
// eslint-disable-next-line no-unused-vars
import Main from "./Main.js";

export default class User {
    inst_id = 0;
    kurs = 0;
    group = "";
    dbResponse = null;
    count = 20;

    /**
     * @type {Group | null}
     */
    groupClass = null;

    /**
     * Класс пользователя
     * @param {String} userID 
     * @param {Main} main
     */
    constructor (userID, main) {
        this.id = userID;
        this.main = main;
    }

    /**
     * Возвращает строку с парами в указанный день
     * Без аргументов даёт пары в сегодняшний день
     * @param {number} day 
     * @param {boolean} week 
     * @returns {string | null}
    */
    async getSchedule(day = new Date().getDay(), week = new Date().getWeek()%2==0) {
        if(!this.group) return null;
        if(!this.groupClass.dbResponse || new Date() - this.groupClass.dbResponse?.updateDate > 1000 * 60 * 60 * 24) {
            let r = await this.groupClass.getDbResponse();
            if (r != 0) return "Произошла ошибка! Повторите попытку позже!";
        }

        let daySchedule = this.groupClass.dbResponse.days.find(elm => elm.daynum == day && elm.even == week)?.schedule ?? [];
        let out = "";

        daySchedule.forEach(elm => {
            out += `\n\n${elm.number} пара: ${elm.name} [${elm.paraType}]\n  Время: ${elm.time}`;
            if(elm.teacher) out += `\n  Преподаватель: ${elm.teacher}`;
            if(elm.auditory) out += `\n  Аудитория: ${elm.auditory}`;
            if(elm.percent) out += `\n  Процент группы: ${elm.percent}`;
            if(elm.flow) out += "\n  В лекционном потоке";
            if(elm.remark) out += `\n  Примечание: ${elm.remark}`;
        });

        return `<b>${this.groupClass.parser.dayName(day)} / ${week ? "Чётная" : "Нечётная"} неделя</b>` + (!out ? "\nПар нет! Передохни:з" : out);
    }

    async getEvents(day = new Date().getDay()) {
        if(!this.group) return null;

        let date = new Date();
        date.setUTCHours(0,0,0,0);

        if(date.getDay() != day) date.setUTCDate(date.getDate()+1); // +1 потому что, что это используется только в расписании на сегодня или завтра        
        
        let dayEvents = await Event.find({date});
        let out = "";
        let filter = (elm) => (!elm.groups.length || elm.groups?.includes(this.group)) && 
            (!elm.kurses.length || elm.kurses?.includes(this.kurs)) &&
            (!elm.inst_ids.length || elm.inst_ids?.includes(this.inst_id));

        dayEvents.filter(filter)
            .forEach((elm, i) => {
                out += `\n\n${i+1}. <b>${elm.name}</b> <i>(${elm.evTime})</i>`;
                if(elm.note) out += `\n  ${elm.note}`;
            });

        return out ? ("<b>СОБЫТИЯ:</b>" + out) : null;

    }

    /**
     * Реализует восстановление данных их БД
     */
    async getData() {
        let model = await Users.findOne({userId: this.id}).exec();

        if(model && model?.inst_id && model?.kurs && model?.group) {
            this.inst_id = model.inst_id;
            this.kurs = model.kurs;
            this.group = model.group;
            
            if(!this.main.groups.find(elm => elm.name == this.group)) this.main.groups.push(new Group(this.inst_id, this.kurs, this.group));

            this.groupClass = this.main.groups.find(elm => elm.name == this.group);
            
        }
    }

    /**
     * Локально очищает данные
     */
    clearData() {
        this.inst_id = 0;
        this.kurs = 0;
        this.group = "";
    }

    /**
     *  Обновление данных на БД
     */
    async updateData() {
        if(!this.main.groups.find(elm => elm.name == this.group)) this.main.groups.push(new Group(this.inst_id, this.kurs, this.group));

        this.groupClass = this.main.groups.find(elm => elm.name == this.group);

        let model = await Users.findOne({userId: this.id}).exec();

        if(!model) {
            model = new Users({
                userId: this.id,
                inst_id: this.inst_id,
                kurs: this.kurs,
                group: this.group
            });
        } else {
            model.inst_id = this.inst_id;
            model.kurs = this.kurs;
            model.group = this.group;
        }

        model.save().catch(err => console.log(err));
    }
}