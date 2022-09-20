import Schedule from "../models/Schedule.js";
import Parser from "./Parser.js";

export default class Group {
    name = "";
    dbResponse = null;

    constructor (instId, kurs, name) {
        this.name = name;
        this.parser = new Parser(instId, kurs, name);
    }

    async getDbResponse() {
        this.dbResponse = await Schedule.findOne({group: this.name}).exec();

        if(!this.dbResponse) {
            let data;
            try {
                data = await this.parser.parseSchedule();
            } catch (err) {
                console.log(err);
                return 1;
            }

            let scheme = {
                group: this.name,
                updateDate: new Date(),
                data
            };

            let dbResp = new Schedule(scheme);

            dbResp.save().catch(err => {console.log(err);});

            this.dbResponse = dbResp;
        }

        if(new Date() - this.dbResponse.updateDate > 1000 * 60 * 60 * 24) {
            // this.dbResponse = await Schedule.findOne({group: this.group}).exec(); // Он может обычным объектом

            let data;
            try {
                data = await this.parser.parseSchedule();
            } catch (err) {
                console.log(err);
                return 0;
            }

            this.dbResponse.data = data;
            this.dbResponse.updateDate = new Date();

            this.dbResponse.save().catch(err => {console.log(err);});
        }

        return 0;
    }
}