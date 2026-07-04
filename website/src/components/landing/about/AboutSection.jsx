import AboutCard from './AboutCard';
import aboutCards from './AboutData';

const About = () => {
    return (
        <section
            id="about"    
            className='scroll-mt-20 px-6 py-24 lg:px-8'
        >
            <div className='mx-auto max-w-7xl'>
                <div className='grid gap16 lg:grid-cols-2 lg:items-start'>

                    {/* Left */}
                    <div>
                    <h2 className='mb-8 text-4xl font-bold text-[#191c1d]'>
                        Why We Built TabMarko
                    </h2>

                    <div className='space-y-5 text-lg leading-relaxed text-[#414754]'>
                        <p>
                            Modern browsers help us discover information,
                                but not organize it.
                        </p>
                        <p>
                            TabMarko transforms scattered tabs and
                                bookmarks into an AI-powered knowledge
                                workspace, helping students, developers,
                                researchers, and professionals rediscover
                                information whenever they need it.
                        </p>
                    </div>
                </div>

            {/* Right */}
            <div className='space-y-4'>
                {aboutCards.map((card) => (
                    <AboutCard 
                        key={card.id}
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                    />
                ))}
                </div>
            </div>
        </div>
        </section>
    );
};

export default About;