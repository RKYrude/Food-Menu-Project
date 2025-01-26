import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Foodcards(props) {

    const navigate = useNavigate();
    const location = useLocation();

    const [showMore, setShowMore] = useState(false);
    const [base64Image, setBase64Image] = useState("");
    const [showDelConfirm, setShowDelConfirm] = useState(false);



    useEffect(() => {
        setShowDelConfirm(false)
    }, [location]);;

    function toggleShowMore() {
        setShowMore(!showMore);
    }

    function handleDeleteClick(event) {
        event.stopPropagation();
        setShowDelConfirm(!showDelConfirm);
    }

    function handleEditDishClick(event) {
        event.stopPropagation();
        let dishToEdit = props.item;

        navigate("/edititem", { state: dishToEdit });
    }

    async function ConfirmDelete() {
        const deletionId = props.item.id;

        console.log(deletionId);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/deleteitem`, { deletionId });
            props.fetchData();
            setShowDelConfirm(false);
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        if (props.item.itemimage.data) {
            // Extract the binary data array
            const binaryData = props.item.itemimage.data;

            // Convert binary data to Base64
            const base64 = btoa(
                binaryData.map((byte) => String.fromCharCode(byte)).join("")
            );

            setBase64Image(`data:image/png;base64,${base64}`);
        }
    }, [props.item.itemimage]);


    return (
        <div>

            {props.adminpg &&
                <input style={{ display: "none" }} type="number" name="dishid" value={props.id} readOnly={true} />
            }
            <div className="foodcard"
                 style={
                    props.item.itemtype === "nonveg"
                        ? {
                            border: "2px solid #7A3618",
                            backgroundColor: "#ffe9e1"
                        }
                        : {
                            border: "2px solid green",
                            backgroundColor: "#eaffec"
                        }
                }
                onClick={toggleShowMore}
            >

                <div className="img-cont">
                    {
                        props.item.itemtype == "veg" ?
                            (<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                <rect x="1" y="1" width="22" height="22" stroke="#4CAF50" fill="none" strokeWidth="2" rx="4" ry="4" />
                                <circle cx="12" cy="12" r="6" fill="#4CAF50" />
                            </svg>) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                    <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                    <rect x="1" y="1" width="22" height="22" stroke="#7A3618" fill="none" strokeWidth="2" rx="4" ry="4" />
                                    <polygon points="12,6 6,16 18,16" fill="#7A3618" />
                                </svg>
                            )
                    }
                    <img
                        src={base64Image === "" ? "https://placehold.co/600x400?text=No%20Image%20\nSelected" : base64Image}
                        alt={props.item.itemname}
                    />
                </div>

                <aside>
                    <h3>{props.item.itemname}</h3>

                    {props.item.itemvariant.length > 1
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="8" fill={`${showMore ? '#747474' : '#8319BC'}`} />
                            <path d="M6.5 4.5L11 8L6.5 11.5z" fill="white" transform={`rotate(${showMore ? -90 : 90} 8 8)`}
                                style={{
                                    transition: 'transform 0.3s ease',
                                }} />
                        </svg>
                        : ""
                    }

                    <div className="primaryoption ">
                        <p>{props.item.itemvariant[0].variantName} </p>
                        <span>₹ {props.item.itemvariant[0].variantPrice}</span>
                    </div>

                    <div className={`dropdown ${showMore ? 'active' : ''}`}>

                        {props.item.itemvariant.slice(1).map((varpice, index) => (
                            <div className="dropdownoption" key={index}>
                                <p>{varpice.variantName}</p>
                                <span>₹{varpice.variantPrice}</span>
                            </div>
                        ))}

                    </div>

                    {props.adminpg &&
                        <div className="buttcont">

                            <button type="button" className="deletebutt" onClick={handleDeleteClick}>
                                Delete
                            </button>

                            <button className="editbutt" onClick={handleEditDishClick}>
                                Edit Details
                            </button>
                        </div>
                    }
                </aside>
            </div>
        </div>
    )
}