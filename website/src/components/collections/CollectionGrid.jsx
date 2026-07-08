import CollectionCard from './CollectionCard';

const CollectionGrid = ({ collections = [] }) => {
    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {collections.map((collection)=> (
                <CollectionCard
                    key={collection.id}
                    collection={collection}
                />
            ))}
        </div>
    )
}

export default CollectionGrid;