import OverviewGrid from '../../components/dashboard/overview/OverviewGrid'
import RecentCollections from '../../components/dashboard/collections/RecentCollections'
import QuickActions from '../../components/dashboard/actions/QuickActions'
import RecentActivity from '../../components/dashboard/activity/RecentActivity'

const Dashboard = () => {
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <div className=' flex flex-col gap-6 lg:flex-row lg:gap-8'>

                    {/* Main Content */}
                    <div className='fflex flex-1 flex-col gap-6 lg:gap-8'>
                        <OverviewGrid />
                        <RecentCollections />
                    </div>

                    {/* Right Sidebar */}
                    <div className='flex w-full flex-col gap-6 lg:w-80 lg:shrink-0 lg:gap-8'>
                        <QuickActions />
                        <RecentActivity />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard