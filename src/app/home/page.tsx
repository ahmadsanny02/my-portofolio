import About from "./About/page"
import Certificates from "./Certificates/page"
import GithubContributions from "./GithubContributions/page"
import Skills from "./Skills/page"

const Home = () => {
    return (
        <div className="">
            <About />
            <Skills />
            <GithubContributions />
            <Certificates />
        </div>
    )
}

export default Home