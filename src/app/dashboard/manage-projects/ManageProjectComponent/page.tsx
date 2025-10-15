import { Plus } from "lucide-react"
import LayoutsDashboard from "../../Layouts/layout"

const manageProjectComponent = () => {
    return (
        <LayoutsDashboard>
            <div className="">
                <form action="" method="post" className="flex items-center gap-5">
                    <input type="text" name="description" className="bg-white/10 p-2 rounded" placeholder="Project Name" />
                    <input type="text" name="projectName" className="bg-white/10 p-2 rounded" placeholder="Description" />
                    <input type="text" name="techStack" className="bg-white/10 p-2 rounded" placeholder="Tech Stack"/>
                    <button type="submit" className="flex items-center gap-2 bg-green-700 hover:bg-green-800 transition-all duration-300 ease-in-out cursor-pointer p-2 rounded">
                        <Plus />
                        <div className="">
                            Add Project
                        </div>
                    </button>
                </form>
            </div>
        </LayoutsDashboard>
    )
}

export default manageProjectComponent