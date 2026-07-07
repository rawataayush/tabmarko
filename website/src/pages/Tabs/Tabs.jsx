import TabsHeader from '../../components/tabs/TabsHeader';
import FilterBar from '../../components/tabs/FilterBar';
import TabGroupGrid from '../../components/tabs/TabGroupGrid';
import { useState } from 'react';
import tabsGroup from '../../data/TabsData';

const Tabs = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filteredGroups = selectedFilter === 'All' ? tabsGroup : tabsGroup.filter((group) => group.category === selectedFilter)
    
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <TabsHeader />
                <FilterBar 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
                <TabGroupGrid 
                    groups={filteredGroups}
                />
            </div>
        </main>
    )
}

export default Tabs;