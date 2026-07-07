import KnowledgeWelcome from '../../components/knowledgeBase/KnowledgeWelcome';
import ChatInput from '../../components/knowledgeBase/ChatInput';
import ConversationSidebar from '../../components/knowledgeBase/ConversationSidebar';

const KnowledgeBase = () => {
    return (
        <main className='mt-16 flex h-[calc(100vh-64px)] overflow-hidden md:ml-40'>
            <section className='relative flex flex-1 flex-col overflow-y-auto bg-white px-4 pt-6 pb-28 md:px-6 lg:px-8'>
                <KnowledgeWelcome />
                <ChatInput />
            </section>
            <div className='hidden lg:block'>
                <ConversationSidebar />
            </div>
        </main>
    )
}

export default KnowledgeBase;