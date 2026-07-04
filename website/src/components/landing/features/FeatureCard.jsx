const FeatureCard = ({ icon, title, description}) => {
    return (
        <div className='group rounded-xl border border-[#c1c6d6] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#1A73E8]/40 hover:shadow-lg'>
            <span className='material-symbols-outlined mb-5 text-4xl text-[#1A73E8]'>
                {icon}
            </span>

            <h3 className='mb-3 text-xl font-bold text-[#191c1d]'>
                {title}
            </h3>
            <p className='mb-6 text-sm leading-relaxed text-[#414754]'>
                {description}
            </p>
        </div>
    )
}

export default FeatureCard;