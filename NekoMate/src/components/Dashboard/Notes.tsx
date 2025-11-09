export default function Notes(){
    return (
        <div>
            <div className="text-white space-y-6">
                <p className="text-3xl"> Quick Notes </p>
               <div className="border border-white rounded-xl w-100 h-35">
                <input 
                  type="text"
                  className="w-100 h-35"
                  placeholder="Your short quick notes"
                />
                </div> 
            </div>
        </div>
    )
}