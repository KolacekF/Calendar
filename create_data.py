import datetime
import calendar
import json
import sys

class Day:
    def __init__(self, year, month, day):
        self.date = datetime.date(year, month, day)
        self.n = day
        self.nWeek = self.date.isoweekday()
        self.events = {
            "small": ["sch"] if self.nWeek < 6 else ["free"],
            "big": []
        }
    def to_dict(self):
        return{
            "n": self.n,
            "nWeek": self.nWeek,
            "events": self.events
        }

class Month:
    def __init__(self, year, month):
        self.year = year
        self.month = month
        _, num_days = calendar.monthrange(year, month)
        self.days = {str(day): Day(self.year, self.month, day) for day in range(1, num_days + 1)}
    def to_dict(self):
        return{
            "n": self.month,
            "days": {day: self.days[day].to_dict() for day in self.days}
        }

def export_calendar(year, start_month, end_month, filename="export.json"):
    data = {
        "dictionary":{
            "free": "icons/free.png",
            "sch": "icons/sch.png"
        },
        "calendar":{
            "months":{
        str(month): Month(year, month).to_dict() for month in range(start_month, end_month + 1)
    }}}

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent = 4)

    print(f"Data saved in {filename}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"{3 - len(sys.argv)} arguments are missing. Add first and last month")
    else:
        try:
            int(sys.argv[1])
            int(sys.argv[2])
            if int(sys.argv[1]) > int(sys.argv[2]): raise ValueError("starting date must be lower then ending date")
            export_calendar(datetime.datetime.now().year, int(sys.argv[1]), int(sys.argv[2]))
        except:
            print("Argument error. Script will end.")
    #export_calendar(2025, 5, 6)