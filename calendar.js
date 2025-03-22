class Day{
    constructor(data, m, dictionary){
        //this.data = JSON.parse(JSON.stringify(data))
        this.dateNumber = data.n;
        this.monthNum = m;
        this.weekDayNum = data.nWeek;
        this.eventSmall = [...data.events.small];
        this.eventBig = [...data.events.big];
        this.dictionary = dictionary;
        this.clickHandler = this.clickHandler.bind(this); //Bind to this instance
    }

    createElement(){
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let controlDate = new Date(today.getFullYear(), this.monthNum - 1, this.dateNumber, 0, 0, 0, 0);
        let element = document.createElement("li");
        let wrapper = document.createElement("div");
        let heading = document.createElement("div");
        let headDate = document.createElement("p");
        let headContent = document.createElement("div");
        let content = document.createElement("div");

        this.appendImages(headContent, this.eventSmall);
        this.appendImages(content, this.eventBig);
        headDate.innerHTML = this.dateNumber + ".";
        element.addEventListener("click", this.clickHandler);

        element.classList.add("date");
        wrapper.classList.add("date_wrapper");
        heading.classList.add("head_wrapper");
        headContent.classList.add("date_head");
        content.classList.add("date_cont");
        if (controlDate.valueOf() == today.valueOf()) {
            element.id = "today";
        }

        heading.appendChild(headDate);
        heading.appendChild(headContent);
        wrapper.appendChild(heading);
        wrapper.appendChild(content);
        element.appendChild(wrapper);
        return element;
    }
    appendImages(element, codes){
        //if codes are empty, do nothing and return
        if (codes.length < 1){
            return
        }
        //else for every image code in codes [] append image child to given element
        for (const code of codes) {
            let image = document.createElement("img");
            let image_wrapper = document.createElement("div");

            image_wrapper.classList.add("image_wrapper");
            //image.src = "icons/" + code + ".png";
            image.src = this.dictionary[code];

            image_wrapper.appendChild(image);
            element.appendChild(image_wrapper);
        }
    }

    //method that returns the same parameters, to reconstruct the Day{}
    returnObject(){
        let data = {
            n: this.dateNumber,
            nWeek: this.weekDayNum,
            events: {
                small: [...this.eventSmall],
                big: [...this.eventBig]
            }
        };
        let m = this.monthNum;
        let dictionary = this.dictionary;

        return([data, m, dictionary]);
    }
    clickHandler(){
        //method to be evrriden
        console.log("Hi" + this.dateNumber);
    }
}

class Month{
    constructor(data, dictionary){
        this.monthNum = data.n;
        this.dates = []; //array of Date {}s

        this.createDates(data, dictionary);
    }
    createDates(data, dictionary){ //CREATES DATE{} FROM json AND .push() THEM TO this.dates 
        //for (const date of data.days) {
        //    this.dates.append(new Date(date));
        //}
        for (const key in data.days){
            this.dates.push(new Day(data.days[key], this.monthNum, dictionary))
        }
    }
}

class Data{
    constructor(data){
        this.data = JSON.parse(JSON.stringify(data));
        this.nOfMonths = Object.keys(this.data.calendar.months).length;
        this.months = Object.keys(this.data.calendar.months);
    }
    createMonth(n){ //n...number of month
        const m = new Month(this.data.calendar.months[n], this.data.dictionary);
        return m;
    }
}


async function getData() {
    //const url = "https://example.org/products.json";
    //const url = "http://kolacek.atwebpages.com/TEST_calendar_PHP/data.json";
    const url = "data.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log("data fetched");
      let d = new Data(json);
      return d;
    } catch (error) {
      console.error(error.message);
    }
  }






//const X = new Date();

export {getData, Day}