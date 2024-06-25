import React, { useState } from 'react';

const HandleImageUpload = ({ onImageChange }) => {
    const [base64img, setBase64img] = useState(null);
    const [img, setImg] = useState({ tipo: null, contenido: null });

    const updateImage = (event) => {
        if (event.target.files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                const parts = base64.match(/^data:image\/([a-z0-9]+);base64,(.+)$/);
                console.log("Base64", parts);
                setBase64img(reader.result);
                setImg({ tipo: parts[1], contenido: parts[2] });

                onImageChange({ tipo: parts[1], contenido: parts[2] });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={updateImage} />
            {base64img && <img src={base64img} alt="Preview" />}
        </div>
    );
};

export default HandleImageUpload;

