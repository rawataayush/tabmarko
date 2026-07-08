const SuggestionCard = ({ suggestion, onSelect }) => {
    return (
        <button
            type='button'
            onClick={() => onSelect?.(suggestion.title)}
            className='group h-full flex flex-col gap-2 rounded-xl border border-[#c1c6d6] bg-white p-5 text-left transition-colors hover:border-[#1a73e8]/40 hover:shadow-sm hover:bg-[#f3f4f5]'
        >
            <span className='flex items-center gap-1 text-sm font-medium'
                style={{ color: suggestion.color }}
            >
                <span className='material-symbols-outlined text-[16px]'>
                    {suggestion.icon}
                </span>

                {suggestion.type}
            </span>

            <span className='text-md text-[#191c1d] transition-colors group-hover:text-[#1A73E8]'>
                {suggestion.title}
            </span>
        </button>
    )
}

export default SuggestionCard;
