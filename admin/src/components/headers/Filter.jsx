export default function Filter(props) {

    return (
        <div className="filter">
            <button
                type="button"
                onClick={props.handleFilterClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* <!-- First line and filled circle --> */}
                    <line x1="4" y1="8" x2="28" y2="8" />
                    <circle cx="10" cy="8" r="2" fill="white" />

                    {/* <!-- Second line and filled circle --> */}
                    <line x1="4" y1="16" x2="28" y2="16" />
                    <circle cx="22" cy="16" r="2" fill="white" />

                    {/* <!-- Third line and filled circle --> */}
                    <line x1="4" y1="24" x2="28" y2="24" />
                    <circle cx="16" cy="24" r="2" fill="white" />
                </svg>
            </button>
        </div>
    )
}