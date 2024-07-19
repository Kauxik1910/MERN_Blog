import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }) => {
    const [visibilityOfPassword, setVisibilityOfPassword] = useState(false)

    return (
        <div className="relative w-[100%] mb-4">
            <input 
                name={name}
                type={type == "password" ? visibilityOfPassword ? "text" : "password" : type }
                id={id}
                defaultValue={value}
                placeholder={placeholder}
                disabled={disable}
                className="input-box"
            />
            <i class={"fi " + icon + " input-icon"}></i>
            {
                type == "password" ?
                <i class={"fi fi-rr-eye" + (!visibilityOfPassword ? '-crossed' : '' ) + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => setVisibilityOfPassword(currentVal => !currentVal)}></i> 
                : ""
            }
        </div>
    )
}

export default InputBox;