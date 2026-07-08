import SuggestionActions from './SuggestionActions';

const SuggestionsCard = ({ suggestion, onApply, onDismiss }) => {
    return (
        <div className='flex flex-col rounded-xl border border-[#c1c6d6] bg-white p-6 transition hover:border-[#1a73e8] hover:shadow-md'>
            <div className='mb-5 flex items-start justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f0fe]'>
                    <span className='material-symbols-outlined text-[#1a73e8]'>
                        {suggestion.icon}
                    </span>
                </div>

                {suggestion.impact && (
                    <span className={`rounded px-2 py-1 text-xs font-medium ${suggestion.impactColor}`}>
                        {suggestion.impact}
                    </span>
                )}
            </div>

            <div className='mb-6'>
                <h3 className='mb-2 text-xl font-semibold text-[#191c1d]'>
                    {suggestion.title}
                </h3>

                <p className='leading-relaxed text-[#6b7280]'>
                    {suggestion.description}
                </p>
            </div>

            <SuggestionActions onApply={onApply} onDismiss={onDismiss} />
        </div>
    )
}

export default SuggestionsCard;