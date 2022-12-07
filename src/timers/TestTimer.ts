import Timer from "../structures/Timer.js";
import Users from "../models/Users.js";

export default class TestTimer extends Timer {
    time = 5000;

    async exec() {
        // let usersID = (await Users.find({notification: true}).exec()).map(elm => {
        //     return elm.userId;
        // })

        // console.log(usersID);
    }
    
}