// /**
//  * 
//  * @param {Date} date 
//  * @returns 
//  */
// function evenWeek(date) {
//     let now   = date.getTime();
//     let today = new Date(date.getFullYear(), date.getMonth(), 0).getTime(); 
//     let week  = Math.ceil((now - today) / (1000 * 60 * 60 * 24 * 7));

//     console.log(week);
    
//     return week%2 == 0;
// }

// console.log(new Date().getFullYear());

// for(let i = 0;i<30;i++) {
//     console.log(i+1, evenWeek(new Date(2022, 8, i)));
// }

let now = new Date();
let testDate = new Date( now.getFullYear(), now.getMonth(), 30 );
let testDate2 = new Date( testDate.getFullYear(), testDate.getMonth(), testDate.getDate()+2 );

console.log(testDate2);

// for(let i = 0;i<30;i++) {
//     console.log(i, new Date(2022, 8, i).getWeek());
// }


// var now     = new Date();
// var start   = new Date(now.getFullYear(), 0, 0);
// var diff    = now - start;
// var oneDay  = 1000 * 60 * 60 * 24;
// var day     = Math.floor(diff / oneDay);

// console.log(day);