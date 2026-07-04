const StepCard = ({icon, title, description}) => {
    return (
        <div className='relative z-10 flex flex-1 flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c1c6d6] bg-white shadow-sm'>
                <span className='material-symbols-outlined text-4xl text-[#1A73E8]'>
                    {icon}
                </span>
            </div>

            <h3 className='mb-2 text-lg font-bold text-[#191c1d]'>
                {title}
            </h3>
            <p className='max-w-55 text-sm leading-relaxed text-[#414754]'>
                {description}
            </p>
        </div>
    )
}

export default StepCard;