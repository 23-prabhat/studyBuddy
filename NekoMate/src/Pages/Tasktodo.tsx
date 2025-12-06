import SideBar from "@/components/Dashboard/SideBar";

export default function Tasktodo(){
    return (
        <div className="flex min-h-screen bg-[#0D1117] text-white font-sans">
            <SideBar />
             <h1 className="text-2xl text-center"> your todos</h1>
        </div>
    )
}