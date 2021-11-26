let month_text = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let day_text = ["D", "L", "M", "X", "J", "V", "S"];

const dateEachDay = (year, month, day) => {
    let date = new Date(year, month, 0);
    return new Date(date.setDate(day));
}

const getCalendar = (year) => {
    let output = [];
    for (i = 320; i < 366; i++) {
        let date = new Date(year, month, 0);
        date = new Date(date.setDate(i));
        let day = date.getDate()
        let weekDay = day_text[date.getDay()];
        let month = month_text[date.getMonth()];
        output.push({
            day: day,
            weekDay: weekDay,
            month: month,
            year: year
        })
    }
    return output;
}


let date = new Date(2021, 10, 26);
console.log(typeof date)

// console.log(getCalendar(today.getFullYear()))
// console.log(month_text[today.getMonth()].toUpperCase())
