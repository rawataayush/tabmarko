import duplicateItems from '../../data/DuplicateData';
import DuplicateCard from './DuplicateCard';
import DuplicateItem from './DuplicateItem';

const DuplicateGrid = ({duplicateGroups, onKeepBest, onRemoveDuplicate}) => {
    return (
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            {duplicateGroups.map((group) => (
                <DuplicateCard
                    key={group.id}
                    group={group}
                    onKeepBest={onKeepBest}
                    onRemoveDuplicate={onRemoveDuplicate}
                />
            ))}
        </div>
    )
}

export default DuplicateGrid;