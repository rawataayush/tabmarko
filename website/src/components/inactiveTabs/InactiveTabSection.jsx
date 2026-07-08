import InactiveTabRow from './InactiveTabRow';

const InactiveTabSection = ({section, onArchive, onDismiss, onArchiveSection}) => {
    return (
        <section>
            {/* Section Header */}
            <div className='mb-4 flex items-center justify-between border-b border-[#ececec] pb-3'>
                <h3 className='flex items-center gap-2 text-xl font-semibold text-[#191c1d]'>
                    <span 
                        className='material-symbols-outlined'
                        style={{color: section.iconColor}}
                    >
                        {section.icon}
                    </span>
                    {section.title}
                </h3>

                <button 
                    onClick={onArchiveSection}
                    className='text-sm font-medium text-[#6b7280] transition hover-text-[#1a73e8]'
                >
                    Archive All
                </button>
            </div>

            {/* Tabs */}
            <div className='overflow-hidden rounded-xl border border-[#c1c6d6] bg-white shadow-sm'>
                {section.tabs.map((tab) => (
                    <InactiveTabRow
                        key={tab.id}
                        tab={tab}
                        onArchive={onArchive}
                        onDismiss={onDismiss}
                    />
                ))}
            </div>

        </section>
    )
}

export default InactiveTabSection;