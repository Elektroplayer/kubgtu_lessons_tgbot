import fetch from "node-fetch";
import https from "https";
import { parse } from "node-html-parser";

const agent = new https.Agent({ rejectUnauthorized: false }); // Для отклонения аутентификации

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

    /**
     * Возвращает строку с парами в указанный день
     * Без аргументов даёт пары в сегодняшний день
     * @param {number} day 
     * @param {boolean} week 
     * @returns {string}
     */
    async getLessons(day = new Date().getDay(), week = new Date().getWeek()%2==0) {
        this.even = week ? 2 : 1;
        this.day  = day;

        if(this.day>6) {
            this.day = 0;
            this.even = this.even == 1 ? 2 : 1;
        }

        let res = await fetch(this.URL, {
            headers: {
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            },
            agent
        });

        let text = await res.text();
        this.root = parse(text);

        let responseText = `<b>${this.dayName(this.day)} / ${this.even == 2 ? "Чётная" : "Нечётная"} неделя</b>\n`;

        for(let i=1;;i++) {
            if(!this.getLesson(this.even, this.day, i) && i == 1) {
                responseText += "\nПар нет! Передохни:з";
                break;
            }
            if(!this.getLesson(this.even, this.day, i)) break;

            responseText += "\n" + this.getLesson(this.even, this.day, i);
        }

        return responseText;
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
     * Возвращает true если неделя чётная
     * @returns {boolean}
     */
    evenWeek() {
        // let date  = new Date();
        // let now   = date.getTime();
        // let today = new Date(date.getFullYear(), date.getMonth(), 0).getTime(); 
        // let week  = Math.ceil((now - today) / (1000 * 60 * 60 * 24 * 7));

        // console.log(week);


        
        //return week%2 == 0;
    }

    /**
     * Возвращает строку с информацией об одной указанной паре
     * @param {number} week 
     * @param {number} day 
     * @param {number} num 
     * @returns {string}
     */
    getLesson(week, day, num) {
        if(!this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)) return null;

        return this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)
            .querySelector(".panel-body")
            .childNodes
            .filter(elm => elm?.constructor?.name == "HTMLElement")
            .reduce((text, elm) => {
                return text + "  " + elm.text + "\n";
            }, this.root.querySelector(`#heading_n_${week}_d_${day}_i_${num}`).text.trim() + "\n" );
    }
}
