import Navbar from '../../components/landing/navbar/Navbar';
import Hero from '../../components/landing/hero/Hero';
import FeaturesSection from '../../components/landing/features/FeaturesSection';
import HowItWorks from '../../components/landing/how-it-works/HowItWorks';
import About from '../../components/landing/about/About';
import Footer from '../../components/landing/footer/Footer';
import ProblemSection from '../../components/landing/problem/ProblemSection';

const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <ProblemSection />
            <FeaturesSection />
            <HowItWorks />
            <About />
            <Footer />
        </>
    )
}

export default Landing;