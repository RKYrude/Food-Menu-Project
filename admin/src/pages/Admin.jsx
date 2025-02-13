import "../styles/admin.scss/";
import SearchBar from "../components/headers/Searchbar";
import Filter from "../components/headers/Filter";
import Foodcards from "../components/Foodcards";
import Filtermenu from "../components/headers/Filtermenu";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/headers/Sidebar";
import Sidebarmenu from "../components/headers/Sidehbarmenu";

function Admin(props) {

    const navigate = useNavigate();
    const location = useLocation();

    const [filterOpen, setFilterOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errMsg, setErrmsg] = useState("");

    const [isDeleting, setIsDeleting] = useState(false);
    const [Deleted, setDeleted] = useState(null);

    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get("s") || "");
    const [priceOrder, setPriceOrder] = useState(new URLSearchParams(location.search).get("price") || "");
    const [foodPreference, setFoodPreference] = useState(new URLSearchParams(location.search).get("type") || "");


    let message;
    if (Deleted === true) {
        message = (
            <p
                className="deletion-status"
                style={{
                    backgroundColor: "rgb(244, 255, 228)",
                    border: "3px solid rgb(155, 241, 26)",
                    color: "green"
                }}
            >
                Dish Saved Succesfully!!
            </p>
        );
    } else if (Deleted === false) {
        message = (
            <p
                className="deletion-status"
                style={{
                    backgroundColor: "rgb(255, 228, 235)",
                    border: "3px solid rgb(241, 26, 73)",
                    color: "red"
                }}
            >
                ERROR: Failed to Save Dish!!
            </p>
        );
    }


    function handleFilterClick() {
        setFilterOpen(!filterOpen);
    }
    function handleSidebarClick() {
        setSidebarOpen(!sidebarOpen);
    }

    function handleFilterClear() {
        handleFilterClick();
        setPriceOrder("");
        setFoodPreference("")
        navigate(`?s=${searchQuery}`);
    }

    function handleChange(event) {
        const target = event.target;
        const { name, value } = target;
        if (name === "searchBox") { setSearchQuery(value); }
        if (name === "price") { setPriceOrder(value); }
        if (name === "vgnon") { setFoodPreference(value); }
    }

    async function handleSearchSubmit(event) {
        event.preventDefault();

        setFilterOpen(false);

        const URLparams = new URLSearchParams();
        if (searchQuery) URLparams.append("s", searchQuery.trim());
        if (priceOrder) URLparams.append("price", priceOrder);
        if (foodPreference) URLparams.append("type", foodPreference);

        navigate(`?${URLparams.toString()}`);
    }


    async function fetchData() {

        setLoading(true);

        const apiParams = new URLSearchParams(location.search);
        let apiURL = "";

        if (apiParams.toString()) {
            apiURL = `${import.meta.env.VITE_API_URL}/searchdishes?${apiParams}`;
        } else {
            apiURL = `${import.meta.env.VITE_API_URL}/getdishes`;
        }

        try {
            const response = await axios.get(apiURL);
            const dishes = response.data;
            setDishes(dishes);
        } catch (err) {
            console.error("Error fetching data:", err);
            setErrmsg(err.message)
            setError(true)
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [location.search]);


    return (
        <div className="homeMain">

            <header>
                <form action="/search" className="head" onSubmit={handleSearchSubmit}>

                    <Sidebar
                        handleSidebarClick={handleSidebarClick}
                        picture={props.user.picture}
                    />
                    <Sidebarmenu
                        handleSidebarClick={handleSidebarClick}
                        user={props.user}
                        sidebarOpen={sidebarOpen}
                    />

                    <SearchBar
                        setDishes={setDishes}
                        handleChange={handleChange}
                        searchQuery={searchQuery}
                    />

                    <Filter
                        handleFilterClick={handleFilterClick}
                    />
                    <Filtermenu
                        handleFilterClick={handleFilterClick}
                        handleChange={handleChange}
                        priceOrder={priceOrder}
                        foodPreference={foodPreference}
                        handleFilterClear={handleFilterClear}
                        filterOpen={filterOpen}
                    />

                </form>

                <h1 className="greeting">Menu Editor</h1>

                {/* <p className="bug-report">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bug-fill" viewBox="0 0 16 16">
                        <path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A5 5 0 0 0 3 6h10a5 5 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A5 5 0 0 0 8 1a5 5 0 0 0-2.731.811l-.29-.956z" />
                        <path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975" />
                    </svg>
                    Report a bug
                </p> */}
            </header>

            <section className="itemList">
                <button className="addnew" onClick={() => navigate('/additem')}>
                    Add New Dish
                </button>

                {!loading ? (
                    dishes.length > 0 ? (

                        dishes.map((item, index) => (
                            <Foodcards
                                key={index}
                                id={item.id}
                                item={item}
                                adminpg={true}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                                setDeleted={setDeleted}
                                fetchData={fetchData}
                            />
                        ))
                    ) : (
                        error ? (
                            <div className="err-msg">

                                <div className="top">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                    <p>ERROR!</p>
                                </div>
                                <div className="bottom">
                                    <p>Failed to fetch dishes</p>
                                    <p>( {errMsg} )</p>
                                    <button onClick={() => {
                                        setLoading(true)
                                        setError(false)
                                        fetchData()
                                    }}>RETRY</button>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <h2>No dishes found</h2>
                            </div>
                        )
                    )
                ) : (
                    <div className="loader">
                        <p>Fetching Dish</p>
                    </div>
                )}

            </section>

            {
                message
            }

        </div>
    );
}

export default Admin;