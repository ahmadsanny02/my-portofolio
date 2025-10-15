import { GitBranch } from "lucide-react"
import GithubContributionComponent from "./GithubContributionComponent/GithubContributionComponent"

const GithubContributions = () => {
    return (
        <div className="mt-10">
            <div className="flex items-center gap-1 font-semibold">
                <GitBranch />
                <h1 className="text-2xl">Github Contributions</h1>
            </div>
            <p className="my-5">
                The following GitHub contributions reflect my activities in managing code, building projects, and improving my programming skills.
            </p>
            <GithubContributionComponent user="ahmadsanny2" />
        </div>
    )
}

export default GithubContributions