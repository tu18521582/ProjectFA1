import { useState } from "react";

function Input(props) {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        props.parentCallback(value);
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={value} onChange={handleChange} style={{ height: '100px', fontSize: '30px' }} />
        </form>
    )
}

export default Input;