const SuggestionActions = ({ onApply, onDismiss }) => {
    return (
        <div className='mt-auto flex gap-3 border-t border-[#ececec] pt-4'>
            <button
                onClick={onApply}
                className='
                flex-1
                rounded-lg
                bg-[#1A73E8]
                py-2
                font-medium
                text-white
                transition
                hover:opacity-90
            '
            >
                Apply
            </button>

            <button
                onClick={onDismiss}
                className='
                flex-1
                rounded-lg
                border
                border-[#c1c6d6]
                bg-[#f8f9fa]
                py-2
                font-medium
                text-[#414754]
                transition
                hover:bg-[#ececec]
            '
            >
                Dismiss
            </button>
        </div>
    )
}

export default SuggestionActions;