const DuplicateActions = ({ onKeepBest, onRemoveDuplicate }) => {
    return (
        <div className='mt-6 flex gap-3 border-t border-[#ececec] pt-4'>
            <button 
                onClick={onKeepBest}
                className='flex-1 rounded-lg bg-[#1A73E8] py-2 font-medium text-white transition hover:opacity-90'
            >
                Keep Best
            </button>

            <button 
                onClick={onRemoveDuplicate}
                className='flex-1 rounded-lg bg-[#f3f4f5] py-2 font-medium text-[#414754] transition hover:bg-[#ececec]'
            >
                Remove Duplicates
            </button>
        </div>
    )
}

export default DuplicateActions;