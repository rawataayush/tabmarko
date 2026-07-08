import DuplicateItem from './DuplicateItem';
import DuplicateActions from './DuplicateActions';

const DuplicateCard = ({ group, onKeepBest, onRemoveDuplicate }) => {
    return (
        <div className='rounded-xl border border-[#c1c6d6] bg-white p-6'>
            <div className='mb-5 flex items-center justify-between'>

                <div>
                    <h3 className='text-lg font-semibold'>
                        {group.title}
                    </h3>

                    <p className='text-sm text-[#6b7280]'>
                        {group.similarity}
                    </p>
                </div>

                <span className='rounded bg-[#e8f0fe] px-2 py-1 text-xs text-[#1A73E8]'>
                    {group.items.length} Items
                </span>
            </div>

            <div className='space-y-3'>
                {group.items.map(item => (
                    <DuplicateItem
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>

            <DuplicateActions 
                onKeepBest={() => onKeepBest(group)} 
                onRemoveDuplicate={() => onRemoveDuplicate(group)} 
            />
        </div>
    )
}

export default DuplicateCard;