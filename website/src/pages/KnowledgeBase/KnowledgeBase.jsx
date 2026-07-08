import KnowledgeWelcome from '../../components/knowledgeBase/KnowledgeWelcome';
import ChatInput from '../../components/knowledgeBase/ChatInput';
import ConversationSidebar from '../../components/knowledgeBase/ConversationSidebar';
import { useState, useEffect } from 'react';
import { callEmbedAndSearch, fetchTableRows, callConversationalAi } from '../../lib/supabaseClient';

const KnowledgeBase = () => {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localBookmarks, setLocalBookmarks] = useState([]);
    const [localTabs, setLocalTabs] = useState([]);

    useEffect(() => {
        // Pre-load local bookmarks and tabs for context
        fetchTableRows('bookmark_ai_meta').then(setLocalBookmarks).catch(console.error);
        fetchTableRows('tab_ai_meta').then(setLocalTabs).catch(console.error);
        
        // Load sessions
        const saved = localStorage.getItem('tabmarko_chats');
        if (saved) {
            setSessions(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            let currentId = sessionId;
            let newSessions = [...sessions];
            
            if (!currentId) {
                currentId = Date.now().toString();
                setSessionId(currentId);
                const title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
                newSessions.unshift({ id: currentId, title, group: 'Today', messages });
            } else {
                const index = newSessions.findIndex(s => s.id === currentId);
                if (index !== -1) {
                    newSessions[index].messages = messages;
                }
            }
            
            setSessions(newSessions);
            localStorage.setItem('tabmarko_chats', JSON.stringify(newSessions));
        }
    }, [messages, sessionId]); // Intentionally omitting sessions to avoid loops

    const handleNewSession = () => {
        setMessages([]);
        setSessionId(null);
    };

    const handleSelectSession = (id) => {
        const session = sessions.find(s => s.id === id);
        if (session) {
            setMessages(session.messages);
            setSessionId(id);
        }
    };

    const handleQuestion = async (query) => {
        const historySnapshot = [...messages];
        setMessages((current) => [...current, { role: 'user', content: query }]);
        setLoading(true);

        try {
            // 1. Get semantic search matches or fallback to keyword search
            const searchRes = await callEmbedAndSearch(query);
            const results = normalizeResults(searchRes?.results || searchRes?.data || searchRes?.matches || [], query, localBookmarks, localTabs);
            
            // 2. Format context and history
            const contextString = formatSearchResults(results);
            const recentHistory = historySnapshot.slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
            const historyText = recentHistory ? `\nPrevious conversation:\n${recentHistory}\n` : '';
            
            // 3. Prompt the conversational AI
            const prompt = `You are a helpful AI Knowledge Assistant for a user's browser.
${historyText}
The user asks: "${query}"

Here are the most relevant bookmarks and tabs saved in the user's browser:
${contextString}

Please synthesize a helpful, conversational answer. You should use the provided browser context as your primary source, but you are free to use your general AI knowledge to summarize websites, explain what they do, or provide additional helpful information. Keep it concise.`;

            const aiResponse = await callConversationalAi(prompt, {});
            const answer = aiResponse?.result || aiResponse?.message || aiResponse?.text || "I'm sorry, I couldn't generate a response.";
            
            setMessages((current) => [...current, { role: 'assistant', content: answer }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((current) => [...current, { role: 'assistant', content: 'Sorry, I encountered an error while trying to answer your question.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='mt-16 flex h-[calc(100vh-64px)] overflow-hidden md:ml-40'>
            <section className='relative flex flex-1 flex-col bg-white'>
                <div className='flex-1 overflow-y-auto px-4 pt-6 pb-4 md:px-6 lg:px-8'>
                    {messages.length === 0 ? (
                        <KnowledgeWelcome onPromptSelect={handleQuestion} />
                    ) : (
                        <div className='mx-auto flex w-full max-w-3xl flex-col gap-4 pt-8'>
                            {messages.map((message, index) => (
                                <div
                                    key={`${message.role}-${index}`}
                                    className={`rounded-xl border border-[#c1c6d6] p-4 ${
                                        message.role === 'user' ? 'bg-[#E8F0FE]' : 'bg-white'
                                    }`}
                                >
                                    <p className='text-sm font-semibold text-[#414754]'>
                                        {message.role === 'user' ? 'You' : 'TabMarko'}
                                    </p>
                                    <p className='mt-2 whitespace-pre-wrap text-[#191c1d]'>{message.content}</p>
                                </div>
                            ))}
                            {loading && <p className='text-sm text-[#6b7280]'>Thinking...</p>}
                        </div>
                    )}
                </div>
                <div className='shrink-0 px-4 pb-4 md:px-6 lg:px-8 max-w-4xl mx-auto w-full'>
                    <ChatInput onSubmit={handleQuestion} disabled={loading} />
                </div>
            </section>
            <div className='hidden lg:block'>
                <ConversationSidebar 
                    sessions={sessions}
                    activeSessionId={sessionId}
                    onNewSession={handleNewSession}
                    onSelectSession={handleSelectSession}
                />
            </div>
        </main>
    )
}

function formatSearchResults(results) {
    if (!Array.isArray(results) || results.length === 0) {
        return 'No matching context found.';
    }

    return results
        .slice(0, 10)
        .map((item, index) => {
            const title = item.title || item.bookmark_title || item.url || item.bookmark_url || item.tab_url || `Result ${index + 1}`;
            const url = item.url || item.bookmark_url || item.tab_url || '';
            return `${index + 1}. ${title}\nURL: ${url}`;
        })
        .join('\n\n');
}

function normalizeResults(results, query, localBookmarks, localTabs) {
    if (Array.isArray(results) && results.length > 0) return results;

    const allItems = [...(localBookmarks || []), ...(localTabs || [])];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return allItems
        .map((item) => {
            const url = item.bookmark_url || item.tab_url || item.url || '';
            const haystack = `${item.title || ''} ${url} ${item.category || ''}`.toLowerCase();
            const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
            return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

export default KnowledgeBase;
