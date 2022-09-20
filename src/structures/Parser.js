import fetch from "node-fetch";
import https from "https";
import { parse } from "node-html-parser";

export default class Parser {
    /**
     * @param {number} fakid ID факультета
     * @param {number} kurs Курс
     * @param {number} semestr Семестр
     * @param {string} group Полный номер группы
     */
    constructor(fakid, kurs, group, semestr = new Date().getMonth() > 5 ? 1 : 2) { // Конструктор делает ссылку, к которой будем обращаться
        this.URL = `https://elkaf.kubstu.ru/timetable/default/time-table-student-ofo?iskiosk=0&fak_id=${fakid}&kurs=${kurs}&gr=${group}&ugod=${new Date().getFullYear()}&semestr=${semestr}`;
    }

    async parseSchedule() {
        let res = await fetch(this.URL, {
            headers: {
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            },
            agent: new https.Agent({ rejectUnauthorized: false })
        });

        let text = await res.text();
        this.root = parse(text);

        let out = [];

        for(let w = 1;w<=2;w++) {
            for(let d = 1;d<=6;d++) {
                let schedule = [];
                
                for(let i = 1;;i++) {
                    if(!this.getLessonRaw(w,d,i)) break;

                    schedule.push(this.getLessonRaw(w,d,i));
                }

                if(schedule.length > 0) out.push({
                    daynum: d,
                    even: w == 2,
                    schedule
                });
            }
        }

        return out;
    }

    /**
     * Возвращает строку с днём недели по номеру этого дня недели
     * @param {number} day 
     * @returns {string}
     */
    dayName(day) {
        let days = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"];
        return days[day];
    }

    /**
     * Возвращает объект с информацией об одной указанной паре
     * @param {number} week 
     * @param {number} day 
     * @param {number} num 
     * @returns {string}
     */
    getLessonRaw(week, day, num) {
        if(!this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)) return null;

        let out = {
            number: null,
            time: null,
            name: null,
            paraType: null,
            teacher: null,
            auditory: null,
            remark: null,
            percent: null
        };

        let firstTextArray = this.root.querySelector(`#heading_n_${week}_d_${day}_i_${num}`).text
            .trim()
            .split("/")
            .map(elm => {return elm.trim();});
        
        out.number = firstTextArray[0].slice(0,1);

        out.time = firstTextArray[0].match(/\(.+\)/g)[0];
        out.time = out.time.substring(1,out.time.length-1);

        out.name = firstTextArray[1];
        out.paraType = firstTextArray[2];

        this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)
            .querySelector(".panel-body")
            .childNodes
            .filter(elm => elm?.constructor?.name == "HTMLElement")
            .forEach(elm => {
                if(elm.text.startsWith("Преподаватель:")) out.teacher = elm.text.slice(15).trim() == "" ? "Не назначен" : elm.text.slice(15).trim();
                if(elm.text.startsWith("Аудитория:")) out.auditory = elm.text.slice(11).trim() == "" ? null : elm.text.slice(11).trim();
                if(elm.text.startsWith("Примечание:")) out.remark = elm.text.slice(12).trim() == "" ? null : elm.text.slice(12).trim();
                if(elm.text.startsWith("Процент группы:")) out.percent = elm.text.slice(16).trim() == "" ? null : elm.text.slice(16).trim();
            });
            
        return out;
    }
}
