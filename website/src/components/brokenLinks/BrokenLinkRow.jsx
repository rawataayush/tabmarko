import BrokenLinkActions from './BrokenLinkActions';

const statusColors = {
    "404 Not Found": "bg-red-100 text-red-600",
    "500 Server Error": "bg-purple-100 text-purple-700",
    "DNS Resolution": "bg-gray-200 text-gray-700",
};

const BrokenLinkRow = ({link, onDelete}) => {
    return (
        <div className="group grid grid-cols-12 items-center gap-4 border-b border-[#ececec] px-6 py-4 transition hover:bg-[#f8fafc]">
            {/* Bookmark */}

            <div className="col-span-12 flex items-start gap-3 md:col-span-6">
                <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded text-white"
                    style={{
                        backgroundColor: link.color || '#1A73E8',
                    }}
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {link.icon || 'link_off'}
                    </span>
                </div>

                <div className="min-w-0">
                    <h3 className="truncate font-medium text-[#191c1d]">
                        {link.title}
                    </h3>

                    <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate text-sm text-[#6b7280] hover:text-[#1A73E8]"
                    >
                        {link.url}
                    </a>

                    {/* Mobile */}

                    <div className="mt-2 flex items-center gap-2 md:hidden">
                        <span
                            className={`rounded-full px-2 py-1 text-[11px] font-medium ${statusColors[link.status] || statusColors["DNS Resolution"]}`}
                        >
                            {link.status}
                        </span>

                        <span className="text-xs text-[#6b7280]">
                            {link.checked || 'Just now'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status */}

            <div className="hidden md:block md:col-span-3">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[link.status] || statusColors["DNS Resolution"]}`}
                >
                    {link.status}
                </span>
            </div>

            {/* Last Checked */}

            <div className="hidden items-center justify-end md:flex md:col-span-3">
                <span className="mr-4 text-sm text-[#6b7280] group-hover:hidden">
                    {link.checked || 'Just now'}
                </span>
                <BrokenLinkActions onDelete={() => onDelete(link.id)} />
            </div>

            {/* Mobile Buttons */}

            <div className="col-span-12 mt-2 flex justify-end gap-2 md:hidden">
                <button className="rounded border border-[#c1c6d6] px-3 py-1.5 text-sm">
                    Edit URL
                </button>

                <button 
                    onClick={() => onDelete(link.id)}
                    className="rounded bg-red-500 px-3 py-1.5 text-sm text-white"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default BrokenLinkRow;