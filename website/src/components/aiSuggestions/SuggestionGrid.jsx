import SuggestionsCard from './SuggestionsCard';
import { useState, useEffect } from 'react';
import { fetchTableRows } from '../../lib/supabaseClient';

const SuggestionGrid = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function loadSuggestions() {
            try {
                const [tabs, bookmarks] = await Promise.all([
                    fetchTableRows('tab_ai_meta'),
                    fetchTableRows('bookmark_ai_meta')
                ]);

                if (!cancelled) {
                    const tabUrlSet = new Set();
                    let dupeTabs = 0;
                    if (tabs) {
                        for (const t of tabs) {
                            const norm = (t.tab_url || t.url || '').split('?')[0].replace(/\/$/, '');
                            if (tabUrlSet.has(norm)) dupeTabs++;
                            else tabUrlSet.add(norm);
                        }
                    }

                    let dupeBookmarks = 0;
                    const bmUrlSet = new Set();
                    if (bookmarks) {
                        for (const b of bookmarks) {
                            const norm = (b.bookmark_url || b.url || '').split('?')[0].replace(/\/$/, '');
                            if (bmUrlSet.has(norm)) dupeBookmarks++;
                            else bmUrlSet.add(norm);
                        }
                    }

                    const newSuggestions = [];
                    
                    if (dupeTabs > 0) {
                        newSuggestions.push({
                            id: 1,
                            icon: 'content_copy',
                            title: `Close ${dupeTabs} duplicate tabs`,
                            description: `You have ${dupeTabs} duplicate web tabs saved in the database. Cleaning them up will reduce visual clutter.`,
                            impact: 'High Impact',
                            impactColor: 'bg-red-100 text-red-700',
                        });
                    }

                    if (dupeBookmarks > 0) {
                        newSuggestions.push({
                            id: 3,
                            icon: 'bookmark_remove',
                            title: `Merge ${dupeBookmarks} similar bookmarks`,
                            description: `Found ${dupeBookmarks} duplicate bookmarks across your folders in the database.`,
                            impact: 'Maintenance',
                            impactColor: 'bg-blue-100 text-blue-700',
                        });
                    }

                    if (newSuggestions.length === 0) {
                        newSuggestions.push({
                            id: 4,
                            icon: 'check_circle',
                            title: 'Everything is organized!',
                            description: "Your tabs and bookmarks are perfectly organized. Great job!",
                            impact: 'Perfect',
                            impactColor: 'bg-green-100 text-green-700',
                        });
                    }

                    setSuggestions(newSuggestions);
                }
            } catch (err) {
                console.error('Failed to load suggestions:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadSuggestions();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <p className='text-gray-500 animate-pulse text-lg'>AI is analyzing your tabs...</p>
            </div>
        );
    }

    const removeSuggestion = (id) => {
        setSuggestions(current => {
            const next = current.filter(s => s.id !== id);
            if (next.length === 0) {
                return [{
                    id: 4,
                    icon: 'check_circle',
                    title: 'Everything is organized!',
                    description: "Your tabs and bookmarks are perfectly organized. Great job!",
                    impact: 'Perfect',
                    impactColor: 'bg-green-100 text-green-700',
                }];
            }
            return next;
        });
    };

    const handleDismiss = (id) => {
        removeSuggestion(id);
    };

    const handleApply = (suggestion) => {
        if (suggestion.id === 1) { // Close duplicate tabs
            window.postMessage({ type: 'TABMARKO_CLOSE_DUPLICATE_TABS' }, '*');
        }
        // Dismiss after apply
        removeSuggestion(suggestion.id);
    };

    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {suggestions.map((suggestion) => (
                <SuggestionsCard 
                    key={suggestion.id}
                    suggestion={suggestion}
                    onApply={() => handleApply(suggestion)}
                    onDismiss={() => handleDismiss(suggestion.id)}
                />
            ))}
        </div>
    )
}

export default SuggestionGrid;