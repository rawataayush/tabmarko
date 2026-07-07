import SuggestionGrid from './SuggestionGrid';

const KnowledgeWelcome = () => {
    return (
        <div className='flex flex-col items-center px-6 pt-8 text-center lg:h-full lg:justify-center'>
                <div className='mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0FE]'>
                    <span className='material-symbols-outlined text-[32px] text-[#1A73E8] py-1'>
                        auto_awesome
                    </span>
                </div>

                <h2 className='mb-3 text-3xl font-bold text-[#191c1d] md:text-4xl'>
                    Your Knowledge Assistant
                </h2>

                <p className='mb-8 max-w-lg text-base md:text-lg text-[#414754]'>
                    Ask questions about your saved tabs, request summaries,
                    or find connections across your collections.
                </p>

                <div className='w-full max-w-5xl'>
                    <SuggestionGrid />
                </div>
        </div>
    )
}

export default KnowledgeWelcome;