import { Day } from "./calendar.js";

class DOM{
    constructor(){
        this.currentMonth = 0; //unused
        this.months = {}; //internal log of months,  used for updating, items are not deleted in this object
        this.shownMonths = {}; //months shown in HTML DOM
        this.shownNullMonths = {}; //empty dates for months shown in HTML DOM
        this.table = document.getElementById("calendarList"); //HTML DOM element for calendarList
    }

    //for every date of month.dates
    // - based on weekday num, nullDates get created to put dates on right positions
    //   - only if there is no month in this.shownMonths[n-1]
    // - every date of month.dates get logged in this.shownMonths {monthNum: [date,date,...]}
    // - "calendarList".appendChild() -> put at the end of "calendarList"
    // - if month is not the last, update the next month
    createMonth(month){
        //creating nullDates
        if (!((month.dates[0].monthNum - 1) in this.shownMonths)) {
            this.createNullDates(month.dates[0]);    
        }
        
        //creating the dates
        for (const date of month.dates) {
            //create HTML DOM element
            const element = date.createElement();
            //log the created element to this.shownMonths{}
            !(date.monthNum in this.shownMonths) && (this.shownMonths[date.monthNum] = []); //short-circuiting
            this.shownMonths[date.monthNum].push(element);
            //append created element to the end of table
            this.table.appendChild(element);
        }

        //logging input data to this.months{}
        !(month.dates[0].monthNum in this.months) && (this.months[month.dates[0].monthNum] = []); //short-circuiting
        this.months[month.dates[0].monthNum].push(month);

        //checking if month is the last, if it is not, update the next month
        if ((month.dates[0].monthNum + 1) in this.shownMonths) {
            this.updateMonth(month.dates[0].monthNum + 1);
        }
    }

    //based on firstDayOfMonth.weekDayNum, create the right amount of empty dates, so that days in table are alligned
    createNullDates(firstDayOfMonth){
        const emptyDate = new Day({n:0,nWeek:0,events:{small:[],big:[]}}, firstDayOfMonth.monthNum)
        for (let i = firstDayOfMonth.weekDayNum - 1; i > 0; i--) {
            //create HTML DOM element
            const element = emptyDate.createElement();
            element.classList.add("null_day");
            //log the created element to this.shownMonths{}
            !(emptyDate.monthNum in this.shownNullMonths) && (this.shownNullMonths[emptyDate.monthNum] = []); //short-circuiting
            this.shownNullMonths[emptyDate.monthNum].push(element);
            //append created element to the end of table
            this.table.appendChild(element);
        }
    }

    removeMonth(n){
        for (const element of this.shownMonths[n]) {
            element.remove();
        }
        delete this.shownMonths[n];

        if (n in this.shownNullMonths) {
            for (const element of this.shownNullMonths[n]) {
                element.remove();
            }
            delete this.shownNullMonths[n];
        }
    }

    updateMonth(month){
        //if input is int, assign it Month{} from this.months{}
        if (Number.isInteger(month)) {
            month = this.months[month][0];
        }

        //remove the old month
        this.removeMonth(month.dates[0].monthNum);
        
        //create the updated month
        this.createMonth(month);
    }
}

export {DOM}