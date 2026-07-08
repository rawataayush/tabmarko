import SummaryCard from './SummaryCard';

const InactiveSummaryCards = ({ cards = [] }) => {
    return (
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card)=>(
                <SummaryCard
                key={card.id}
                card={card}
            />
        ))}
        </div>
    )
}

export default InactiveSummaryCards;