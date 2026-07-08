const BrokenLinkActions = ({ onDelete }) => {
    return (
        <>
            <div
    className="
        flex items-center gap-1
        md:hidden
    "
>
    <button
        title="Replace URL"
        className="rounded p-1.5 text-[#6b7280] transition hover:bg-[#e8f0fe] hover:text-[#1A73E8]"
    >
        <span className="material-symbols-outlined text-[18px]">
            edit
        </span>
    </button>

    <button
        title="Ignore"
        className="rounded p-1.5 text-[#6b7280] transition hover:bg-[#f3f4f5]"
    >
        <span className="material-symbols-outlined text-[18px]">
            visibility_off
        </span>
    </button>

    <button
        onClick={onDelete}
        title="Delete"
        className="ml-1 rounded p-1.5 text-red-500 transition hover:bg-red-100"
    >
        <span className="material-symbols-outlined text-[18px]">
            delete
        </span>
    </button>
</div>

{/* Desktop Hover Actions */}
<div
    className="
        hidden
        items-center
        gap-1
        md:group-hover:flex
    "
>
    <button
        title="Replace URL"
        className="rounded p-1.5 text-[#6b7280] transition hover:bg-[#e8f0fe] hover:text-[#1A73E8]"
    >
        <span className="material-symbols-outlined text-[18px]">
            edit
        </span>
    </button>

    <button
        title="Ignore"
        className="rounded p-1.5 text-[#6b7280] transition hover:bg-[#f3f4f5]"
    >
        <span className="material-symbols-outlined text-[18px]">
            visibility_off
        </span>
    </button>

    <button
        onClick={onDelete}
        title="Delete"
        className="ml-1 rounded p-1.5 text-red-500 transition hover:bg-red-100"
    >
        <span className="material-symbols-outlined text-[18px]">
            delete
        </span>
    </button>
</div>
            </>
            )
}

export default BrokenLinkActions;