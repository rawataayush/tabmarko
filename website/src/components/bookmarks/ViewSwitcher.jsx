const ViewSwitcher = ({ viewMode, setViewMode }) => {
    return (
        <div className='flex overflow-hidden rounded-lg border border-[#c1c6d6]'>
            <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition ${viewMode === 'list' ? 'bg-[#1A73E8] text-white' : 'bg-white text-[#414754] hover:bg-[#f3f4f5]'}`}
                title='List View'
            >
                <span className='material-symbols-outlined'>
                    view_list
                </span>
            </button>

            <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition ${viewMode === 'grid' ? 'bg-[#1A73E8] text-white' : 'bg-white text-[#414754] hover:bg-[#f3f4f5]'}`}
                title='Grid View'
            >
                <span className='material-symbols-outlined'>
                    grid_view
                </span>
            </button>
        </div>
    )
}

export default ViewSwitcher;