import React from "react";
import HomeHeader from "../component/HomeHeader";
import details from "../Details";
import Message from "../component/Message"
import StatusGrid from "../component/Status";

const MainPage = () => {
    const { message1, message2} = details.Request[0]; 

    return (
        <div>
            <HomeHeader />
            <div >
            <Message 
                msg={message1} 
                containerStyle={{ boxShadow: 'none', border: 'none', marginTop: '80px', animation: 'none', backgroundColor: 'transparent' }} 
                textStyle={{ color: 'blue', fontSize: '20px' }} 
            />
            <Message 
                msg={message2} 
                containerStyle={{ boxShadow: 'none', border: 'none', marginTop: '130px', animation: 'none', backgroundColor: 'transparent' }} 
                textStyle={{ color: 'green', fontSize: '22px' }} 
            />
            </div>
            <StatusGrid />
        </div>
    );
};

export default MainPage;