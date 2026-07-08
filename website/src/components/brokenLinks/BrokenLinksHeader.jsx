const BrokenLinksHeader = ({ totalCount, onScan, isScanning, onDeleteAll }) => {
    return (
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

        {/* Left */}
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#191c1d] sm:text-3xl">
                Broken Links
            </h2>

            <p className="mt-2 text-sm text-[#6b7280] sm:text-base">
                {totalCount} links require your attention. We couldn't reach these
                destinations during the last scan.
            </p>
        </div>

        {/* Right */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            <button 
                onClick={onScan}
                disabled={isScanning}
                className={`w-full rounded-lg border border-[#c1c6d6] bg-[#f3f4f5] px-4 py-2 font-medium transition sm:w-auto ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5e7eb]'}`}
            >
                {isScanning ? 'Scanning...' : 'Scan Now'}
            </button>

            <button 
                onClick={onDeleteAll}
                className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 sm:w-auto"
            >
                Delete All Broken
            </button>
        </div>
    </div>
    )
}

export default BrokenLinksHeader;