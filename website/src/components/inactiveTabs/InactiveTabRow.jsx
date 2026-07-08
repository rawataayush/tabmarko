import InactiveTabActions from './InactiveTabAction';

const InactiveTabRow = ({tab, onArchive, onDismiss}) => {
    return (
        <div className='group flex flex-col gap-4 border-b border-[#ececec] p-4 transition hover:bg-[#f8fafc] md:flex-row md:items-center md:justify-between'>

            {/* Left */}
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: tab.color }}>
                    <span className="material-symbols-outlined text-gray-500">
                        {tab.icon}
                    </span>
                </div>

                <div>
                    <h4 className='truncate font-medium text-[#191c1d]'>
                        {tab.title}
                    </h4>

                    <a 
                        href={tab.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className='truncate text-sm text-[#6b7280] hover:text-[#1A73E8]'
                    >
                        {tab.url}
                    </a>
                </div>
            </div>

            {/* Right */}
            <InactiveTabActions 
                onArchive={() => onArchive(tab.id)} 
                onDismiss={() => onDismiss(tab.id)} 
                url={tab.url}
            />
        </div>
    )
}

export default InactiveTabRow;