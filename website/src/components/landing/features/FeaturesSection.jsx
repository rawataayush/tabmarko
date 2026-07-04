import FeatureCard from './FeatureCard';
import features from './FeaturesData';

const FeaturesSection = () => {
    return (
        <section
            id='features'
            className='scroll-mt-20 px-6 py-24 lg:px-8'
        >
            <div className='mx-auto max-w-7xl'>
                <div className='mb-16 text-center'>
                    <h2 className='mb-6 text-4xl font-bold text-[#191c1d]'>
                        Everything You Need To Say Organized
                    </h2>

                    <p className='text-lg text-[#414754]'>
                        Powerful AI tools built into your browsing workflow.
                    </p>
                </div>

                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {features.map((feature) => (
                        <FeatureCard 
                            key={feature.id}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;