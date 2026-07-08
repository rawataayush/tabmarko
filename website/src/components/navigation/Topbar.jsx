import logo from "../../assets/logo.png";

const Topbar = () => {
    return (
        <header className='fixed top-0 z-30 flex w-full h-16 items-center justify-between bg-[#f8f9fa] px-4 sm:px-6 lg:px-8 shadow-sm'>

            {/* Logo */}
            <div className='flex shrink-0 items-center overflow-hidden'>
                <img src={logo} alt="TabMarko" className="h-12 w-12 shrink-0 md:w-14 md:h-14" />
                <h1 className='whitespace-nowrap font-bold text-3xl text-[#191c1d] transition-all duration-300 w-auto opacity-0 md:opacity-100'>
                    <span className='text-[#191c1d]'>Tab</span>
                    <span className='text-[#1a73e8]'>Marko</span></h1>
            </div>

            {/* Search */}
            <div className='mx-3 hidden flex-1 max-w-md items-center rounded-full border border-[#c1c6d6] bg-[#f3f4f5] px-4 py-2 md:flex lg:max-w-xl'>
                <span className="material-symbols-outlined mr-2 text-[20px] text-[#727785]">
                    search
                </span>

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border-none bg-transparent p-0 text-body-md text-[#191c1d] outline-none placeholder:text-[#414754]"
                />
            </div>

            {/* Actions */}
            <div className='flex shrink-0 items-center gap-2 text-[#414754] sm:gap-3 lg:gap-4'>
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e1e3e4] hover:text-[#005bbf]"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e1e3e4] hover:text-[#005bbf]"
                    onClick={() => {
                        const isDark = document.documentElement.classList.contains('dark');
                        if (isDark) {
                            document.documentElement.classList.remove('dark');
                            localStorage.setItem('tabmarko_theme', 'light');
                        } else {
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('tabmarko_theme', 'dark');
                        }
                    }}
                    title="Toggle Theme"
                >
                    <span className="material-symbols-outlined theme-icon-dark">dark_mode</span>
                    <span className="material-symbols-outlined theme-icon-light">light_mode</span>
                </button>

                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e1e3e4] hover:text-[#005bbf]"
                    onClick={() => {
                        window.postMessage({ type: 'TABMARKO_SYNC' }, '*');
                    }}
                    title="Sync with Extension"
                >
                    <span className="material-symbols-outlined">refresh</span>
                </button>

                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e1e3e4] hover:text-[#005bbf]"
                >
                    <span className="material-symbols-outlined">cloud_done</span>
                </button>
            </div>
        </header>
    )
}

export default Topbar;