const QuickActionButton = ({ icon, title, variant, onClick}) => {
    const classes =
        variant === 'primary'
            ? 'bg-[#1A73E8] text-white hover:bg-[#1558b0]'
            : 'bg-[#e3e2e6] text-[#646468] hover:bg-[#c1c6d6]'
    return (
        <button
            type='button'
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg py-3 px-4 transition-colors ${classes}`}
            >
                <span className='material-symbols-outlined text-[20px]'>
                    {icon}
                </span>

                <span className='font-medium'>
                    {title}
                </span>
        </button>
    )
}

export default QuickActionButton
