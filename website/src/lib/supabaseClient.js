export const SUPABASE_URL = 'https://lixodklnnvvhbzvbiott.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpeG9ka2xubnZ2aGJ6dmJpb3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MTI0MTEsImV4cCI6MjA5ODk4ODQxMX0.8gnjDGigQW5eeQfMe5nvszpM9ZKSbPbvs7wAnJ1o2zc';
export const DEMO_USER_ID = 'd3cadc74-9de7-4f36-b14d-9d425ad41a60';

let anonymousSessionPromise = null;

export async function ensureAnonymousSession() {
    if (!anonymousSessionPromise) {
        anonymousSessionPromise = fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({}),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Anonymous auth failed (${response.status})`);
                }

                return response.json();
            })
            .catch((error) => {
                console.warn('Anonymous auth unavailable, using anon key for demo reads:', error);
                return null;
            });
    }

    return anonymousSessionPromise;
}

async function getAccessToken() {
    const session = await ensureAnonymousSession();
    return session?.access_token || SUPABASE_ANON_KEY;
}

export async function fetchTableRows(tableName) {
    const accessToken = await getAccessToken();
    const query = `select=*&user_id=eq.${DEMO_USER_ID}&order=created_at.desc`;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?${query}`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const retry = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!retry.ok) {
            const details = await retry.text();
            throw new Error(`Failed to fetch ${tableName} (${retry.status}): ${details}`);
        }

        return retry.json();
    }

    return response.json();
}

export async function deleteTableRow(tableName, id) {
    const accessToken = await getAccessToken();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete (${response.status})`);
    }
}

export async function callEmbedAndSearch(text, mode, sourceId) {
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(`${SUPABASE_URL}/functions/v1/super-worker`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                text,
                mode,
                sourceId,
                userId: DEMO_USER_ID,
            }),
        });

        if (!response.ok) {
            throw new Error(`Search failed (${response.status})`);
        }

        return response.json();
    } catch (error) {
        console.warn('Super worker unavailable, falling back to local bookmark search:', error);
        const rows = await fetchTableRows('bookmark_ai_meta').catch(() => []);
        return {
            source: 'local-fallback',
            results: lexicalBookmarkSearch(rows, text),
        };
    }
}

function lexicalBookmarkSearch(rows, query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return rows
        .map((row) => {
            const title = row.title || row.bookmark_title || titleFromUrl(row.bookmark_url || row.url || '');
            const url = row.bookmark_url || row.url || '';
            const category = row.category || 'Bookmark';
            const haystack = `${title} ${url} ${category}`.toLowerCase();
            const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);

            return { title, url, category, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

function titleFromUrl(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url || 'Untitled bookmark';
    }
}

export async function callConversationalAi(prompt, data) {
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ prompt, data, user_id: DEMO_USER_ID }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error calling AI function:', error);
        return null;
    }
}
