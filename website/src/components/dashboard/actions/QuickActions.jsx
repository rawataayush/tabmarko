import QuickActionButton from './QuickActionButton';
import quickActionsData from '../../../data/QuickActionsData';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <section className='rounded-xl border borde-[#c1c6d6] bg-[#ffffff] p-6'>
            <h2 className='mb-4 text-2xl font-semibold text-[#191c1d]'>
                Quick Actions
            </h2>

            <div className='flex flex-col gap-3'>
                {quickActionsData.map((action) => (
                    <QuickActionButton
                        key={action.id}
                        icon={action.icon}
                        title={action.title}
                        variant={action.variant}
                        onClick={() => navigate(action.path)}
                    />
                ))}
            </div>
        </section>
    )
}

export default QuickActions
