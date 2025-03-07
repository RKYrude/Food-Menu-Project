export default function SearchBar(props) {

    return (
        <div className="searchBar">

            <input type="text" name="searchBox" onChange={props.handleChange} value={props.searchQuery || ""} />

            <button>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8319BC"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>
    )
}