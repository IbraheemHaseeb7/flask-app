import React, { useState } from 'react';

export default function Input({ placeholder = "Enter text", value, onChange }) {
    const [inputValue, setInputValue] = useState(value || '');

    const handleChange = (event) => {
        setInputValue(event.target.value);
        if (onChange) {
            onChange(event.target.value); // Call the onChange prop if provided
        }
    };

    return (
        <div>
            <label htmlFor="inputField">Input:</label>
            <input
                id="inputField"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </div>
    );
}
