const AboutCard = ({icon, title, description}) => {
    return (
        <div className='flex items-start gap-4 rounded-xl border border-[#c1c6d6] bg-white p-6 transition-all duration-300 hover:shadow-md'>
            <div className='rounded-lg bg-[#1A73E8]/10 p-3'>
                <span className='material-symbols-outlined text-[#1A73E8]'>
                    {icon}
                </span>
            </div>

            <div>
                <h4 className='mb-1 text-lg font-bold text-[#191c1d]'>
                    {title}
                </h4>
                <p className='text-sm leading-relaxed text-[#414754]'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default AboutCard;