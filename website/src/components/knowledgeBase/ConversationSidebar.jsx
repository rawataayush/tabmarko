const ConversationSidebar = ({ sessions = [], activeSessionId, onNewSession, onSelectSession }) => {
    return (
        <aside className="hidden w-72 h-[calc(100vh-64px)] flex-col border-l border-[#c1c6d6] bg-[#f8f9fa] lg:flex">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#c1c6d6] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#191c1d]">
                    Recent Conversations
                </h3>

                <button 
                    onClick={onNewSession}
                    className="rounded p-1 transition hover:bg-[#e3e2e6]"
                    title="New Conversation"
                >
                    <span className="material-symbols-outlined text-[20px] text-[#414754]">
                        add
                    </span>
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center p-4">
                        <p className="text-sm text-[#6b7280]">
                            Chat history will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`w-full text-left flex items-start gap-3 rounded-lg p-3 transition ${
                                    activeSessionId === session.id
                                        ? 'bg-[#e8f0fe] text-[#1a73e8]'
                                        : 'hover:bg-[#e3e2e6] text-[#414754]'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                                    activeSessionId === session.id ? 'text-[#1a73e8]' : 'text-[#6b7280]'
                                }`}>
                                    chat_bubble
                                </span>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-medium">
                                        {session.title || 'New Conversation'}
                                    </p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {session.messages?.length || 0} messages
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ConversationSidebar;