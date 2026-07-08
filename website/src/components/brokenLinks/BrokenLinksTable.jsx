import BrokenLinkRow from './BrokenLinkRow';

const BrokenLinksTable = ({brokenLinks, onDelete}) => {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#c1c6d6] bg-white shadow-sm">
            {/* Header */}
            <div className="min-w-212.5 grid grid-cols-12 gap-4 border-b border-[#ececec] bg-[#f8fafc] px-6 py-3 text-sm font-semibold text-[#6b7280]">
                <div className="col-span-12 md:col-span-6">
                    Bookmark
                </div>

                <div className="hidden md:block md:col-span-3">
                    Status
                </div>

                <div className="hidden text-right md:block md:col-span-3">
                    Last Checked
                </div>
            </div>

            {/* Rows */}
            <div className='min-w-212.5 divide-y divide-[#ececec]'>
                <div className='max-h-125 overflow-y-auto'>
                    {brokenLinks.map((link) => (
                        <BrokenLinkRow
                            key={link.id}
                            link={link}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrokenLinksTable;