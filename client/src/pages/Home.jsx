import "../styles/home.scss/";
import SearchBar from "../components/headers/Searchbar";
import Filter from "../components/headers/Filter";
import Foodcards from "../components/Foodcards";
import Filtermenu from "../components/headers/Filtermenu";
import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {

    const navigate = useNavigate();
    const location = useLocation();

    const [filterOpen, setFilterOpen] = useState(false);
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errMsg, setErrmsg] = useState("");
    const prevSearchRef = useRef(location.search);


    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get("s") || "");
    const [priceOrder, setPriceOrder] = useState(new URLSearchParams(location.search).get("price") || "");
    const [foodPreference, setFoodPreference] = useState(new URLSearchParams(location.search).get("type") || "");


    function handleFilterClick() {
        setFilterOpen(!filterOpen);
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
        setLoading(true);
        
        if (prevSearchRef.current == location.search) {
            fetchData();
        } else {
            navigate(`?${URLparams.toString()}`);
        }

    }

    async function fetchData() {

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
        prevSearchRef.current = location.search;
        fetchData();
    }, [location.search]);



    return (
        <div className="homeMain">

            <header>
                <form action="/search" className="head" onSubmit={handleSearchSubmit}>
                    {/* submit buttons inside SearchBar and Filter */}
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

                <section className="greeting">
                    <h1>Hello, Foodie</h1>
                    <h3>Let’s Satisfy Your Cravings!</h3>
                </section>
            </header>

            <section className="itemList">
                {!loading ? (
                    dishes.length > 0 ? (
                        dishes.map((item, index) => (
                            <Foodcards
                                key={index}
                                id={item.id}
                                item={item}
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
        </div>
    );
}

export default Home;
