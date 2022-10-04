import Schedule from "../models/Schedule.js";
import Parser from "./Parser.js";

export default class Group {
    name = "";
    dbResponse = null;

    constructor (instId, kurs, name) {
        this.name = name;
        this.parser = new Parser(instId, kurs, name);
    }

    async getDbResponse(forseFromSite = false) {
        this.dbResponse = await Schedule.findOne({group: this.name}).exec();

        if(!this.dbResponse) {
            let days;
            try {
                days = await this.parser.parseSchedule();
            } catch (err) {
                console.log(err);
                return 1;
            }

            let scheme = {
                group: this.name,
                updateDate: new Date(),
                days
            };

            this.dbResponse = new Schedule(scheme);

            this.dbResponse.save().catch(err => {console.log(err);});
        }

        if(new Date() - this.dbResponse.updateDate > 1000 * 60 * 60 * 24 || forseFromSite) {
            // this.dbResponse = await Schedule.findOne({group: this.group}).exec(); // Он может обычным объектом

            let days;
            try {
                days = await this.parser.parseSchedule();
            } catch (err) {
                console.log(err);
                return 0;
            }

            this.dbResponse.days = days;
            this.dbResponse.updateDate = new Date();

            this.dbResponse.save().catch(err => {console.log(err);});
        }

        return 0;
    }
}