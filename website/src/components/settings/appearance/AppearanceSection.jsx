import DensityToggle from './DensityToggle';
import ThemeToggle from './ThemeToggle';

const AppearanceSection = () => {
    return (
        <section>
            <h3 className='mb-4 border-b border-[#c1c6d6] pb-2 text-xl font-semibold text-[#191c1d]'>
                Appearance
            </h3>

            <div className="space-y-6 rounded-xl border border-[#c1c6d6] bg-white p-6 shadow-sm">
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <label className='mb-1 block text-lg font-medium text-[#191c1d]'>
                            Theme
                        </label>
                        <p className='text-[#6b7280]'>
                            Choose your preferred visual style.
                        </p>
                    </div>

                    <ThemeToggle />
                </div>

                <div className='h-px bg-[#ececec]' />

                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <label className='mb-1 block text-lg font-medium text-[#191c1d]'>
                            Density
                        </label>
                        <p className='text-[#6b7280]'>
                            Adjust the spacing between items in lists.
                        </p>
                    </div>

                    <DensityToggle />
                </div>
            </div>
        </section>
    )
}

export default AppearanceSection;