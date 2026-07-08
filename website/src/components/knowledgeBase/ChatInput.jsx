import { useState } from 'react';

const ChatInput = ({ onSubmit, disabled = false }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        const query = value.trim();
        if (!query || disabled) return;
        onSubmit?.(query);
        setValue('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className='w-full bg-linear-to-t from-white via-white to-transparent pt-4 pb-2 z-20 shrink-0 mt-auto'>
            <div className='relative overflow-hidden rounded-[20px] border border-[#c1c6d6] bg-white shadow-sm'>
                <textarea
                    rows={2}
                    placeholder='Ask about your knowledge base...'
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className='max-h-52 min-h-14 w-full resize-none border-none bg-transparent p-4 pb-2 text-base text-[#191c1d] outline-none placeholder:text-[#6b7280]'
                />

                <div className='flex items-center justify-between px-4 pb-3'>
                    <div className='flex items-center gap-2'>
                        <button className='rounded-md p-1.5 transition hover:bg-[#f3f4f5]'>
                            <span className='material-symbols-outlined text-[20px]'>
                                attach_file
                            </span>
                        </button>

                        <div className='mx-1 h-6 w-px bg-[#c1c6d6]' />

                        <button className='flex items-center gap-1 rounded-md border border-[#c1c6d6] bg-[#f8f9fa] px-3 py-1 text-sm text-[#414754] transition hover:bg-[#f3f4f5]'>
                            <span className='material-symbols-outlined text-[16px]'>
                                folder
                            </span>

                            All Collections
                        </button>
                    </div>

                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={disabled || !value.trim()}
                        className='flex h-9 w-9 items-center justify-center rounded-full bg-[#1A73E8] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <span className='material-symbols-outlined text-[18px]'>
                            arrow_upward
                        </span>
                    </button>
                </div>
            </div>

            <p className='mt-3 text-center text-xs text-[#6b7280]'>
                AI can make mistakes. Verify important information.
            </p>
        </div>
    );
};

export default ChatInput;
