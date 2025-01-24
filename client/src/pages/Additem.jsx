import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../styles/additem.scss";
import Varietyinput from "../components/Varietyinput";
import Buttonforimage from "../components/buttons/Buttonforimage";
import Buttonforsaving from "../components/buttons/Buttonforsaving";
import { useNavigate } from "react-router-dom";


function Additem() {
    const navigate = useNavigate();

    const [preview, setPreview] = useState("https://placehold.co/600x400?text=No%20Image%20\nSelected");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);

    const [base64Image, setBase64Image] = useState("");

    let message;
    if (submitted === true) {
        message = (
            <p
                className="submition-status"
                style={{
                    backgroundColor: "rgb(244, 255, 228)",
                    border: "3px solid rgb(155, 241, 26)",
                    color: "green"
                }}
            >
                Dish Saved Succesfully!!
            </p>
        );
    } else if (submitted === false) {
        message = (
            <p
                className="submition-status"
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


    const [varietyItems, setvarietyItems] = useState([{
        id: uuidv4(),
        variantName: "",
        variantPrice: ""
    }]);

    const [formData, setFormData] = useState({
        itemimage: "",
        itemname: "",
        itemtype: "",
        itemvariant: varietyItems,
    });




    // Functtitons

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {

                setPreview(reader.result);
                setBase64Image("");
            };
            reader.readAsDataURL(file);

            setFormData((prevData) => ({
                ...prevData,
                itemimage: file,
            }));

        }
    };

    function addvariant() {
        setvarietyItems(
            [...varietyItems,
            {
                id: uuidv4(),
                variantName: "",
                variantPrice: ""
            }
            ]
        );

    }
    function handleVariantDelete(idToDelete) {
        setvarietyItems(
            (prevItems) => prevItems.filter((item) => item.id !== idToDelete)
        );
    }

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleVarietyChange(event) {
        const { name, value } = event.target;
        const id = event.target.getAttribute("data-id");

        setvarietyItems((prevItems) =>
            prevItems.map((item) =>
                item.id == id ? { ...item, [name]: value } : item
            )
        );
    }
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            itemvariant: varietyItems,
        }));
    }, [varietyItems]);


    //Form Validation and Submition
    function validateForm() {
        const newErrors = {};

        if (!formData.itemimage) newErrors.itemimage = "*Item Image is required";
        if (!formData.itemname.trim()) newErrors.itemname = "*Item name is required";
        if (!formData.itemtype) newErrors.itemtype = "*Choose Item type";

        for (let i = 0; i < formData.itemvariant.length; i++) {
            if (!formData.itemvariant[i].variantName.trim() || !formData.itemvariant[i].variantPrice.trim()) {
                newErrors.itemvarprice = "*Vaient or price can't be empty";

                break;
            }
        }

        setErrors(newErrors);

        return (Object.keys(newErrors).length === 0);
    }

    async function handleSave() {
        if (validateForm()) {
            const formDataToSend = new FormData();

            setIsSubmitting(true);

            formDataToSend.append("itemimage", formData.itemimage);
            formDataToSend.append("itemname", formData.itemname);
            formDataToSend.append("itemtype", formData.itemtype);
            formDataToSend.append("itemvariant", JSON.stringify(formData.itemvariant));


            try {

                const response = await axios.post(`${import.meta.env.vite_api_url}:3000/addnewitem`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("Success:", response.data.message);

                setSubmitted(true);

                setTimeout(() => {
                    setSubmitted(null);
                    navigate(-1)
                }, 1000)

            } catch (err) {
                console.error("Error:", err);
                setSubmitted(false);
                setIsSubmitting(false);
            } 
        }
    }


    return (
        <div className="additem">
            <h1>Add Food Item</h1>
            <form action="/addnewitem">
                <section className="imgcont">
                    <div className="imgholder" >
                        {/* <img src={preview} alt="Preview" /> */}
                        <img src={base64Image === "" ? preview : base64Image} alt={formData.itemname} />
                    </div>

                    <input
                        name="itemimage"
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                    {errors.itemimage && <p style={{ color: "red" }}>{errors.itemimage}</p>}

                    <Buttonforimage
                        page="add"
                    />
                </section>

                <section className="itemnamecont">
                    <div>
                        <label>Item Name</label>
                        <input onChange={handleChange} name="itemname" type="text" />
                        {errors.itemname && <p style={{ color: "red" }}>{errors.itemname}</p>}
                    </div>

                    <div>
                        <label>Type</label>
                        <div className="typecont">
                            {/* Veg Option */}
                            <label>
                                <input onChange={handleChange} type="radio" name="itemtype" value="veg" />
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                        <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                        <rect x="1" y="1" width="22" height="22" stroke="#4CAF50" fill="none" strokeWidth="2" rx="4" ry="4" />
                                        <circle cx="12" cy="12" r="6" fill="#4CAF50" />
                                    </svg>
                                </span>
                            </label>

                            {/* Non-Veg Option */}
                            <label>
                                <input onChange={handleChange} type="radio" name="itemtype" value="nonveg" />

                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                        <rect x="0" y="0" width="24" height="24" fill="white" rx="7" ry="7" />
                                        <rect x="1" y="1" width="22" height="22" stroke="#7A3618" fill="none" strokeWidth="2" rx="4" ry="4" />
                                        <polygon points="12,6 6,16 18,16" fill="#7A3618" />
                                    </svg>
                                </span>
                            </label>
                        </div>
                        {errors.itemtype && <p style={{ color: "red" }}>{errors.itemtype}</p>}
                    </div>
                </section>

                <section className="itemvariantcont">
                    <label>Item Variant</label>


                    {varietyItems.map((item) => (
                        <Varietyinput
                            key={item.id}
                            id={item.id}
                            arrLen={varietyItems.length}
                            variantName={item.variantName}
                            variantPrice={item.variantPrice}
                            deleteVariety={handleVariantDelete}
                            handleVarietyChange={handleVarietyChange}
                        />
                    ))}


                    {errors.itemvarprice && <p style={{ color: "red" }}>{errors.itemvarprice}</p>}

                    <button onClick={addvariant} className="morevariant" type="button">+</button>
                </section>

                <Buttonforsaving
                    page="add"
                    handleSave={handleSave}
                    isSubmitting={isSubmitting}
                />
            </form>

            {
                message
            }


        </div>
    );
}

export default Additem;