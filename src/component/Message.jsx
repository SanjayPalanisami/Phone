import React from 'react';
import './Message.css';

const Message = (props) => {
  // Default styles for the container and message text
  const messageContainerStyle = {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    ...props.containerStyle, 
  };

  const messageTextStyle = {
    ...props.textStyle, 
  };

  return (
    <div className="message-container" style={messageContainerStyle}>
      <p className="message-text typing-animation" style={messageTextStyle}>{props.msg}</p>
    </div>
  );
};

export default Message;