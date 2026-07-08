const CollectionCard = ({ icon, name, items, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className='flex cursor-pointer flex-col gap-3 rounded-xl border border-[#c1c6d6] bg-[#ffffff] p-4 transition-colors hover:border-[#727785]'
        >
            <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#d8e2ff] text-[#001a41]'>
                    <span className='material-symbols-outlined'>
                        {icon}
                    </span>
                </div>

                <div>
                    <h3 className='font-medium text-[#191c1d]'>
                        {name}
                    </h3>

                    <p className='text-sm text-[#414754]'>
                        {items} Items
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CollectionCard
