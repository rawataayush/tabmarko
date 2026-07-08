const InactiveTabsHeader = ({ onArchiveAll30, count30 }) => {
    return (
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h2 className="text-3xl font-bold text-[#191c1d]">
                    Inactive Tabs
                </h2>

                <p className="mt-2 max-w-2xl text-[#6b7280]">
                    Tabs that haven't been opened recently. Review them to
                    declutter your workspace.
                </p>
            </div>

            {count30 > 0 && (
                <button
                    onClick={onArchiveAll30}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#E8F0FE] px-5 py-3 font-medium text-[#1A73E8] transition hover:bg-[#d8e8fd]"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        done_all
                    </span>

                    Archive All Older Than 30 Days
                </button>
            )}
        </div>
    )
}

export default InactiveTabsHeader;