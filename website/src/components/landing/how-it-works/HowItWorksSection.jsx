import StepCard from './StepCard';
import steps from  './StepsData';

const HowItWorks = () => {
    return (
        <section
            id='how-it-works'
            className='overflow-hidden bg-[#f8f9fa] px-6 py-24 scroll-mt-20 lg:px-8'
        >
            <div className='mx-auto max-w-7xl'>

            <div className='mb-16 text-center'>
                <h2 className='text-4xl font-bold text-[#191c1d]'>
                    How It Works
                </h2>
            </div>

            <div className='relative'>

                {/* Connecting line */}
                <div className='absolute left-0 right-0 top-8 hidden h-px bg-[#c1c6d6] md:block'></div>
                    <div className='relative flex flex-col gap-12 md:flex-row md:justify-between'>
                        {steps.map((step) => (
                            <StepCard 
                                key={step.id}
                                icon={step.icon}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks;