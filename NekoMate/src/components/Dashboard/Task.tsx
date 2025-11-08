export default function Task(){
    return (
        <div className="text-white space-y-6">
            <h1 className="font-sans font-semibold mx-4 text-3xl">Today's task</h1>
            <div className="font-sans space-y-5 mx-7">
               <div className="flex border border-white w-185 h-25 rounded-xl">
                  <p className="mx-5 my-7"> Learn Python basics </p>
               </div>
               <div className="border border-white w-185 h-25 rounded-xl">
                  <p className="mx-5 my-7"> complete all the basics of Operating Sysytem</p>
               </div>
               <div className="border border-white w-185 h-25 rounded-xl">
                  <p className="mx-5 my-7"> complete 10 episodes of One Piece</p>
               </div>
            </div>
        </div>
    )
}