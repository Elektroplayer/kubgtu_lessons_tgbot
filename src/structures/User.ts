import Scene from "./Scene.js";
import Group from "./Group.js";
import Users from "../models/Users.js";
import Cache from "../lib/Cache.js";

export default class User {
    scene?: Scene;
    group?: Group;

    /**
     * Используется для временного хранения данных при настройке
     */
    dataBuffer: {
        id: number,
        inst_id?: number,
        kurs?: number
    }[] = []

    constructor(public id:number) {}

    /**
     * Инициализация группы
     */
    async initGroup() {
        let userData = await Users.findOne({userId: this.id}).exec()

        if(!userData) return;

        if(userData.inst_id && userData.kurs && userData.group) this.setGroup(userData.group, userData.kurs, userData.inst_id)
    }

    /**
     * Обновление данных
     */
    async updateData(opt: { instId: number, kurs: number, group: string }) {
        let userData = await Users.findOne({userId: this.id}).exec()

        if(userData) {
            userData.inst_id = opt.instId;
            userData.kurs = opt.kurs;
            userData.group = opt.group;

            userData.save().catch(console.log);
        } else {
            new Users({
                userId: this.id,
                inst_id: opt.instId,
                kurs: opt.kurs,
                group: opt.group
            }).save().catch(console.log);
        }

        this.setGroup(opt.group, opt.kurs, opt.instId)
    }

    /**
     * Устновка текущей группы у человека
     */
    setGroup(group:string, kurs: number | string, inst_id:number | string) {
        let groupClass = Cache.groups.find(g => g.name == group)

        if(!groupClass) {
            let newGroup = new Group(group, +kurs, +inst_id);

            Cache.groups.push(newGroup);

            this.group = newGroup;
        } else this.group = groupClass;
    }
}