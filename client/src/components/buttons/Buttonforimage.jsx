export default function Buttonforimage(props) {
    return (
        <label htmlFor="fileInput" className="custom-upload-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="12" y1="5" x2="12" y2="19" />
            </svg>
            {props.page=="add" ? "Upload Image" : "Edit Image"}
        </label>
    )
}