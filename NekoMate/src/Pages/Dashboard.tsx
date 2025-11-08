import Calendar from "@/components/Dashboard/Calendar";
import SideBar from "@/components/Dashboard/SideBar";
import Task from "@/components/Dashboard/Task";
import Timer from "@/components/Dashboard/Timer";

export default function Dashboard(){


  return (
    
  <div className="flex grid-cols-3 space-x-25 h-screen bg-gray-900">
     <div>
        <SideBar />
      </div> 
      <div className="my-10">
         <h1 className="text-4xl font-serif text-white font-bold">Hello, Prabhat</h1>
         <p className="text-gray-400 mt-0.5">Let's be productive today</p>
         <div className="mt-15 space-y-15">
            <Task />
            <div className="mx-8">
               <Timer />
            </div>
         </div>
      </div>
      <div className="my-10">
          <Calendar />
      </div>
      </div>
 
  )
}