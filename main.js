import { getData } from "./calendar.js";
import { DOM } from "./htmlDOMcreate.js";
import { Manage } from "./manage.js";

async function Main(){
    const urlParams = new URLSearchParams(window.location.search);
    let dataFetched = await getData();
    let htmlDOMtable = new DOM();

    //set #header_heading.innerHTML to name of today
    let today = new Date();
    document.getElementById("header_heading").innerHTML = today.toLocaleDateString("cs-CZ", { weekday: 'long' }).toUpperCase();

    //use manage.js only if it is specificated in url
    if (urlParams.get("manage")) {
        let m = new Manage(dataFetched, htmlDOMtable);
        
        //modify HTML DOM elements
        document.getElementById("header_heading").innerHTML = "MANAGE";
        document.getElementById("reloadManageBtn").classList.add('inManage');
    }
    

    //for (let i = 1; i <= dataFetched.nOfMonths; i++) {
    //    htmlDOMtable.createMonth(dataFetched.createMonth(i));
    //}
    for (const n of dataFetched.months) {
        htmlDOMtable.createMonth(dataFetched.createMonth(n));
    }
    //htmlDOMtable.createMonth(dataFetched.createMonth(3));
    //htmlDOMtable.createMonth(dataFetched.createMonth(2));
    //htmlDOMtable.createMonth(dataFetched.createMonth(1));

    //htmlDOMtable.createMonth(dataFetched.createMonth(1));
    
    //document.getElementById("today").scrollIntoView();
    
    //if element today exists, show #scrollToTodayBtn and scroll into view
    if (document.body.contains(document.getElementById("today"))) {
        const todayIntoView = () => {
            let today = document.getElementById("today");
            let calendarList = document.getElementById("calendarList");
            
            calendarList.style.scrollBehavior = "smooth";
            calendarList.scroll(today.offsetLeft - 100, today.offsetTop - 200);
            calendarList.style.scrollBehavior = "unset";
        }

        //set #scrollToTodayBtn visible
        let button = document.getElementById("scrollToTodayBtn");
        button.classList.remove("hidden");
        button.addEventListener("click", todayIntoView);


        //scroll today date element into view
        setTimeout(() => {
            todayIntoView();
        }, 300);
    }
}


export {Main}