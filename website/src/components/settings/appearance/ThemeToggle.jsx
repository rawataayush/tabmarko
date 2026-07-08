import { useState, useEffect } from "react";

const ThemeToggle = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const stored = localStorage.getItem('tabmarko_theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('tabmarko_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('tabmarko_theme', 'light');
        }
    };

    return (
        <div className="flex gap-1 rounded-lg border border-[#c1c6d6] bg-[#f8fafc] p-1.5">
            <button
                onClick={() => toggleTheme('light')}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    theme === 'light' 
                        ? 'bg-white text-[#1a73e8] shadow-sm' 
                        : 'text-[#6b7280] hover:bg-[#ececec]'
                    }`}
            >
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                Light
            </button>

            <button
                onClick={() => toggleTheme('dark')}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    theme === 'dark'
                        ? 'bg-white text-[#1a73e8] shadow-sm'
                        : 'text-[#6b7280] hover:bg-[#ececec]'
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                Dark
            </button>
        </div>
    )
}

export default ThemeToggle;
