import { useState } from "react"


const daysOfWeek : string[] = ["Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat"]

export default function Calendar (){
   const [currentDate , setCurrentDate] = useState<Date>(new Date())
   const [selectedDate , SetSelectedDate] = useState<Date | null>(null)
  
   //
   const year: number = currentDate.getFullYear()
   const month: number = currentDate.getMonth()

   //first & last days of the current month
   const fisrtDayOfMonth : Date = new Date(year , month , 1)
   const lastDayOfMonth : Date = new Date(year , month+1 , 0 )
   const totaldays : number = lastDayOfMonth.getDate();
   const startDate : number = fisrtDayOfMonth.getDate()

   //month navigation handlers
   const prevmonth = () : void => setCurrentDate(new Date(year , month - 1 , 1))
   const nextMonth = () : void => setCurrentDate(new Date(year , month + 1 , 1))

   //all dates for the month
   const days : (number | null)[] = []
   for(let i = 0 ; i < startDate ; i++ ) days.push(null)
   for(let i = 0 ; i < totaldays ; i++ ) days.push(i)

   //click handler for day selection
   const handleDayClick = (day: number | null): void => {
    if(!day) return;
    SetSelectedDate(new Date(year, month , day));
   }

   return (
        <div className=" border border-white w-135 h-95 my-35 space-y-6 text-white">
            <div>
                <h1 className="font-semibold text-white "> Calendar </h1>
            </div>
            <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevmonth}
              className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-600 transition"
            >
             prev
            </button>
            <h2 className="text-xl font:semibold">
                {currentDate.toLocaleString("default" , {month: "long"})} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="px-3 py-1 rounded-md bg-gray-800 hover:bg-orange-500 transition"
            >
             next
            </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2 text-gray-400">
                {daysOfWeek.map((day) => (
                   <div key={day}> {day} </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day  , index ) => {

                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

                const isSelected = selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

                   return (
                    <div
                     key={index}
                     onClick={() => handleDayClick(day)}
                     className={`py-2 rounded-lg cursor-pointer select-none tarnsition ${
                        day === null
                        ?"" : isSelected
                        ? "bg-gray-700 font-semibold" : isToday
                        ?"bg-gray-700 font-semibold" : "hover:bg-orange-500"
                     }`}
                    >
                       {day || ""} 
                    </div>
                   )
                })}
            </div>

            { selectedDate && (
                selectedDate && (
                    <p> selected : {selectedDate.toDateString()} </p>
                ) )}

        </div>
    )
}