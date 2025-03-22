import { Day } from "./calendar.js";

class Manage{
    constructor(data, dom){
        this.dataObj = data; //Data{}
        this.domObj = dom; //DOM{}
        this.datePreview = {};
        //this.appendElement.createEvent = this.appendElement.createEvent.bind(this); //Bind to this instance

        this.overrideDayClickHandler();
        this.appendElement();
    }
    //call only once. It overrides clickHandler() in Day{} prototype
    overrideDayClickHandler(){
        let that = this;
        
        Day.prototype.clickHandler = function(){
            return that.clickHandler(this);
        }        
    }
    //function that overrides that one in Day{}
    //loads information from clicked day to manage window
    clickHandler(dayObj){
        //let d = new Day(dayObj.returnObject()[0], dayObj.returnObject()[1]);
        this.datePreview = new Day(dayObj.returnObject()[0], dayObj.returnObject()[1], dayObj.returnObject()[2]);

        document.getElementById("datePreview").innerHTML = "";
        for (const wrapper of document.getElementById("eventsWrapper").children) {
            for (const li of wrapper.children) {
                li.classList.remove("logged");
            }
        }

        document.getElementById("datePreview").appendChild(this.datePreview.createElement());
        for (const event of this.datePreview.eventSmall) {
            let id = event + "_" + "Small";
            document.getElementById(id).classList.add("logged");
        }
        for (const event of this.datePreview.eventBig) {
            let id = event + "_" + "Big";
            document.getElementById(id).classList.add("logged");
        }

        //disable #main and show #manage_window
        document.getElementById("main").classList.add("disabled");
        document.getElementById("manage_window").classList.remove("hide");
        document.getElementById("manage_window").classList.add("show");
    }
    
    //create HTML DOM structure for manage window and append it to #manage_window
    appendElement(){
        const createEventElement = (key, path, eventSize) => {
            //create click handler for every events icon in manage window
            const createHandler = () => {
                return (event) => { //nested functions because of this and reference from HTML DOM element back to Manage{}
                    let elementIDSplit = event.currentTarget.id.split("_");
                    let nameOfArray = "event" + elementIDSplit[1];
                    //toggle element in array[]
                    let index = this.datePreview[nameOfArray].indexOf(elementIDSplit[0])
                    if (index === -1){
                        this.datePreview[nameOfArray].push(elementIDSplit[0]);
                    } else {
                        this.datePreview[nameOfArray].splice(index, 1);
                    }

                    //update #datePreview element
                    document.getElementById("datePreview").innerHTML = "";
                    document.getElementById("datePreview").appendChild(this.datePreview.createElement());

                    event.currentTarget.classList.toggle("logged");
                }
            }
            
            let li = document.createElement("li");
            let image = document.createElement("img");

            li.addEventListener("click", createHandler());
            li.id = key + "_" + eventSize;
            image.src = path;

            li.appendChild(image);
            return li;
        }
        const confirmEventHandler = () => {
            return (event) => { //nested functions because of this and reference from HTML DOM element back to Manage{}
                let dateNumber = this.datePreview.dateNumber;
                let monthNumber = this.datePreview.monthNum;
                let DataDateObject = this.dataObj.data.calendar.months[monthNumber].days[dateNumber];
                let HTMLDomElement = this.domObj.months[monthNumber][0].dates[dateNumber-1];
                

                event.currentTarget.classList.add("fetching");

                //modify (update) data entry in Data{}
                DataDateObject.n = this.datePreview.dateNumber;
                DataDateObject.nWeek = this.datePreview.weekDayNum;
                DataDateObject.events.small = [...this.datePreview.eventSmall];
                DataDateObject.events.big = [...this.datePreview.eventBig];
                //modify (update) Date{} in DOM{}
                HTMLDomElement.dateNumber = this.datePreview.dateNumber;
                HTMLDomElement.monthNum = this.datePreview.monthNum;
                HTMLDomElement.weekDayNum = this.datePreview.weekDayNum;
                HTMLDomElement.eventSmall = [...this.datePreview.eventSmall];
                HTMLDomElement.eventBig = [...this.datePreview.eventBig];

                //upload data json to PHP script
                //this.dataObj.data
                //let request = new XMLHttpRequest();
                //request.open("POST", "https://www.kolacek.atwebpages.com/TEST_calendar_PHP/php.php", true);
                //request.setRequestHeader("Content-type", "application/json");
                //request.send("Hello World!")
                async function upload(dataJson, element) {
                    
                  //  (async () => {
                        //const rawResponse = await fetch("http://kolacek.atwebpages.com/TEST_calendar_PHP/setData.php", {
                        const rawResponse = await fetch("setData.php", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                        },
                        body: dataJson
                    });
                    
                    element.classList.remove("fetching");
                    if (rawResponse.status == 200) { //IF upload was OK
                        document.getElementById("manage_window").classList.remove("show");
                        document.getElementById("manage_window").classList.add("hide");
                        document.getElementById("main").classList.remove("disabled");
                    } else{ //IF upload wasnt OK
                        let innerHTML = element.innerHTML;
                        
                        element.classList.add("fetch_failed");
                        element.innerHTML = rawResponse.status;
                        setTimeout(function() {
                            element.innerHTML = innerHTML;
                            element.classList.remove("fetch_failed");
                        }.bind(element, innerHTML), 3000);
                    }
                //})();
                }
                upload(JSON.stringify(this.dataObj.data), event.currentTarget);
                    


                //update the #calendarList - it updates from this, not from uploaded data, so no need to wait for fetching
                this.domObj.updateMonth(monthNumber);

            }
        }
        
        let element = document.getElementById("manage_window");
        
        let headerWrapper = document.createElement("div");
        let datePreview = document.createElement("div");
        let eventsWrapper = document.createElement("div");
        let eventsSmall = document.createElement("ul");
        let eventsBig = document.createElement("ul");
        for (const key in this.dataObj.data.dictionary) {
            eventsSmall.appendChild(createEventElement(key, this.dataObj.data.dictionary[key], "Small"));
            eventsBig.appendChild(createEventElement(key, this.dataObj.data.dictionary[key], "Big"));
        }
        let buttonsWrapper = document.createElement("div");
        let confirmBtn = document.createElement("div");
        let cancelBtn = document.createElement("div");
        confirmBtn.addEventListener("click", confirmEventHandler());
        cancelBtn.addEventListener("click", () => {
            //hide #manage_window
            document.getElementById("manage_window").classList.remove("show");
            document.getElementById("manage_window").classList.add("hide");
            document.getElementById("main").classList.remove("disabled");
        })



        headerWrapper.id = "headerWrapper";
        datePreview.id = "datePreview";
        eventsWrapper.id = "eventsWrapper";
        eventsSmall.classList.add("eventsSmall");
        eventsBig.classList.add("eventsBig");
        buttonsWrapper.classList.add("buttonsWrapper");
        confirmBtn.classList.add("confirmBtn");
        cancelBtn.classList.add("cancelBtn");

        eventsWrapper.appendChild(eventsSmall);
        eventsWrapper.appendChild(eventsBig);
        headerWrapper.appendChild(datePreview);
        headerWrapper.appendChild(eventsWrapper);
        buttonsWrapper.appendChild(cancelBtn);
        buttonsWrapper.appendChild(confirmBtn);
        element.appendChild(headerWrapper);
        element.appendChild(buttonsWrapper);
    }
}

export {Manage}