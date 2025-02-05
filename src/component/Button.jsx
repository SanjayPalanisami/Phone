import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Button.css';

const Button = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const targetPath = props.to.startsWith('/') ? props.to : `/${props.to}`;
        navigate(targetPath);
    };

    const buttonStyle = {
        display: 'block',
        margin: '0px auto',
        fontSize: '20px',
        padding: '10px 20px',
        position: 'relative',
    };

    return (
        <button
            className="glow-on-hover profile-button" 
            onClick={handleClick}
            style={buttonStyle}
        >
            {props.bt}
        </button>
    );
};

export default Button;