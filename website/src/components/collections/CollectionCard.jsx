import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
    return (
        <div className='group relative flex flex-col overflow-hidden rounded-xl border border-[#c1c6d6] bg-white p-6 transition hover:shadow-md'>
            <div className='absolute -right-4 -top-4 h-24 w-24 rounded-bl-full bg-[#1A73E8]/5 transition group-hover:scale-110' />

            <div className='relative z-10 mb-4 flex items-start justify-between'>
                <div
                    className='rounded-lg p-3'
                    style={{
                        backgroundColor: collection.iconBg,
                        color: collection.iconColor,
                    }}
                >
                    <span className='material-symbols-outlined'>
                        {collection.icon}
                    </span>
                </div>

                <button>
                    <span className='material-symbols-outlined text-[#6b7280] hover:text-[#191c1d]'>
                        more_vert
                    </span>
                </button>

            </div>

            <h3 className='relative z-10 mb-2 text-lg font-semibold text-[#191c1d]'>
                {collection.title}
            </h3>

            <div className='relative z-10 mb-6 flex items-center gap-4 text-sm text-[#6b7280]'>
                <span className='flex items-center gap-1'>
                    <span className='material-symbols-outlined text-[14px]'>
                        tab
                    </span>

                    {collection.items} items
                </span>

                <span className='flex items-center gap-1'>
                    <span className='material-symbols-outlined text-[14px]'>
                        schedule
                    </span>

                    {collection.updated}
                </span>
            </div>

            <div className='relative z-10 mt-auto border-t border-[#ececec] pt-4'>
                <Link 
                    to={`/dashboard/collections/${encodeURIComponent(collection.title)}`}
                    className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f4f5] px-4 py-2 transition hover:bg-[#e5e7eb]'
                >
                    Open Collection

                    <span className='material-symbols-outlined text-[18px]'>
                        arrow_forward
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default CollectionCard;