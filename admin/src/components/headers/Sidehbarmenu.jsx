import axios from "axios"

export default function Sidebarmenu(props) {



    async function handleDownload() {
        try {
            // const response = await axios.get('https://devfood-server.onrender.com/download/food_landing.png', {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/download/food_landing.png`, {
                responseType: 'blob' //getting in binary
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'QRmenuImage.png'; // Set the downloaded filename
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error('Download error:', err);
        }
    }

    async function handleLogout() {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                withCredentials: true,
            });

            window.location.href = "/login"; // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <div className={`sidebarmenubackground ${props.sidebarOpen ? `active` : ''}`} onClick={props.handleSidebarClick}>

            <div className="sidebarmenu"
                onClick={(e) => e.stopPropagation()}
            >
                <svg
                    className="sidebarcloseButt"
                    onClick={props.handleSidebarClick}
                    xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 16 16"
                >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>

                <section className="sidebarmenuTop">
                    <img src={props.user.picture} alt="" />
                    <h4>{props.user.given_name} {props.user.family_name}</h4>
                    <p>{props.user.email}</p>
                </section>

                <section className="sidebarmenuMid">
                    <button type="button" onClick={handleDownload}>
                        QR-Menu Image
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="white" className="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                    </svg>
                </section>

                <section className="sidebarmenuBot">
                    <button onClick={handleLogout} type="button">
                        Log out
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                    </button>

                </section>
            </div>
        </div>
    )
}