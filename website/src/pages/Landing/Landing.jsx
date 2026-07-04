import Navbar from '../../components/landing/navbar/Navbar';
import Hero from '../../components/landing/hero/Hero';
import FeaturesSection from '../../components/landing/features/FeaturesSection';
import HowItWorksSection from '../../components/landing/how-it-works/HowItWorksSection';
import AboutSection from '../../components/landing/about/AboutSection';
import Footer from '../../components/landing/footer/Footer';
import ProblemSection from '../../components/landing/problem/ProblemSection';

const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <ProblemSection />
            <FeaturesSection />
            <HowItWorksSection />
            <AboutSection />
            <Footer />
        </>
    )
}

export default Landing;