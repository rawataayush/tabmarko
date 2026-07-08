const SUPABASE_URL = 'https://lixodklnnvvhbzvbiott.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpeG9ka2xubnZ2aGJ6dmJpb3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MTI0MTEsImV4cCI6MjA5ODk4ODQxMX0.8gnjDGigQW5eeQfMe5nvszpM9ZKSbPbvs7wAnJ1o2zc';
const DEMO_USER_ID = 'd3cadc74-9de7-4f36-b14d-9d425ad41a60';

export { SUPABASE_URL, SUPABASE_ANON_KEY, DEMO_USER_ID };

let anonymousSessionPromise = null;

async function getAnonymousAccessToken() {
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
                    throw new Error(`Anonymous auth failed with status ${response.status}`);
                }

                const session = await response.json();
                return session.access_token || SUPABASE_ANON_KEY;
            })
            .catch((error) => {
                console.warn('Falling back to anon key without anonymous session:', error);
                return SUPABASE_ANON_KEY;
            });
    }

    return anonymousSessionPromise;
}

async function supabaseFetch(path, options = {}) {
    const accessToken = await getAnonymousAccessToken();
    const response = await fetch(`${SUPABASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Supabase request failed (${response.status}): ${details}`);
    }

    if (response.status === 204) return null;
    return response.json();
}

export async function callAiCategorizer(prompt, data) {
    try {
        const accessToken = await getAnonymousAccessToken();
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

export const callConversationalAi = callAiCategorizer;

export async function saveTabAiMeta({ tabUrl, title, category }) {
    // Note: title is accepted but not sent — the DB table has no title column
    return supabaseFetch('/rest/v1/tab_ai_meta', {
        method: 'POST',
        headers: {
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
            user_id: DEMO_USER_ID,
            tab_url: tabUrl,
            category,
        }),
    });
}

export async function clearUserTabs() {
    return supabaseFetch(`/rest/v1/tab_ai_meta?user_id=eq.${DEMO_USER_ID}`, {
        method: 'DELETE',
        headers: {
            'Prefer': 'return=minimal',
        }
    });
}

export async function clearUserBookmarks() {
    return supabaseFetch(`/rest/v1/bookmark_ai_meta?user_id=eq.${DEMO_USER_ID}`, {
        method: 'DELETE',
        headers: {
            'Prefer': 'return=minimal',
        }
    });
}

export async function saveBookmarkAiMeta({ bookmarkUrl, title, category }) {
    // Note: title is accepted but not sent — the DB table has no title column
    return supabaseFetch('/rest/v1/bookmark_ai_meta', {
        method: 'POST',
        headers: {
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
            user_id: DEMO_USER_ID,
            bookmark_url: bookmarkUrl,
            category,
        }),
    });
}

export async function callEmbedAndSearch(text, mode, sourceId) {
    try {
        const accessToken = await getAnonymousAccessToken();
        const response = await fetch(`${SUPABASE_URL}/functions/v1/super-worker`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
                text,
                mode,
                sourceId,
                userId: DEMO_USER_ID,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error calling embed/search function:', error);
        return null;
    }
}
