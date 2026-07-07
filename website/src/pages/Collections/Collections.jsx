import CollectionHeader from '../../components/collections/CollectionsHeader';
import CollectionGrid from '../../components/collections/CollectionGrid';

const Collections = () => {
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <CollectionHeader />
                <CollectionGrid />
            </div>
        </main>
    )
}

export default Collections