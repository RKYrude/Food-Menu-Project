export default function Filtermenu(props) {



    return (
        <div className="filteroptionbackground" onClick={props.handleFilterClick}>

            <div className="filteroptions"
                onClick={(e) => e.stopPropagation()}
            >
                <svg
                    onClick={props.handleFilterClick}
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="white"
                    className="xcircle bi bi-x-circle"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>

                <h2>Filters And Sorting</h2>

                <hr />

                <div className="sortoption">
                    <p>Sort By</p>
                    <div className="radiooptions">
                        <label className="radio-button">
                            <input
                                type="radio"
                                name="price"
                                value="lowhigh"
                                onChange={props.handleChange}
                                checked={props.priceOrder === "lowhigh"}
                            />
                            <span>PRICE - Low to High</span>
                        </label>
                        <label className="radio-button">
                            <input
                                type="radio"
                                name="price"
                                value="highlow"
                                onChange={props.handleChange}
                                checked={props.priceOrder === "highlow"}
                            />
                            <span>PRICE - High to Low</span>
                        </label>
                    </div>
                </div>
                <div className="vegnonoption">
                    <p>Veg/Non-veg Preference</p>
                    <div className="radiooptions">
                        <label className="radio-button">
                            <input
                                type="radio"
                                name="vgnon"
                                value="veg"
                                onChange={props.handleChange}
                                checked={props.foodPreference === "veg"}
                            />
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                                    {/* <!-- White Background --> */}
                                    <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                    {/* <!-- Square with Green Border and Border Radius --> */}
                                    <rect x="1" y="1" width="22" height="22" stroke="#4CAF50" fill="none" strokeWidth="2" rx="4" ry="4" />
                                    {/* <!-- Green Circle Inside --> */}
                                    <circle cx="12" cy="12" r="6" fill="#4CAF50" />
                                </svg>
                                Veg
                            </span>
                        </label>
                        <label className="radio-button">
                            <input
                                type="radio"
                                name="vgnon"
                                value="non-veg"
                                onChange={props.handleChange}
                                checked={props.foodPreference === "non-veg"}
                            />
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                                    {/* <!-- White Background --> */}
                                    <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                    {/* <!-- Square with Brown Border and Border Radius --> */}
                                    <rect x="1" y="1" width="22" height="22" stroke="#7A3618" fill="none" strokeWidth="2" rx="4" ry="4" />
                                    {/* <!-- Brown Triangle Inside (Centered) --> */}
                                    <polygon points="12,6 6,16 18,16" fill="#7A3618" />
                                </svg>
                                Non-veg
                            </span>
                        </label>
                    </div>
                </div>

                <hr />

                <div className="buttcont">
                    <button type="submit" onClick={props.handleFilterClear}>Clear All</button>
                    <button >Apply Filter</button>
                </div>
            </div>
        </div>
    )
}