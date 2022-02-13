import React, { useState } from "react";
import './Header.css';
import companyLogo from '../../assets/logo.svg';
import Button from '@material-ui/core/Button';



export default function Header(props) {

    const [isloggedIn, setIsLoggedIn] = useState(true);
    console.log(props)

    const enableBooking = props.enableBooking;

    return (
        <div className="header">
            <img className="logo" src={companyLogo} alt="company logo">
            </img>
            <div>

                {/* Display Login/LogOut button as per login status */}
                {isloggedIn ?
                    <Button className="btn" variant="contained" size="small">LOGOUT</Button> :
                    <Button className="btn" variant="contained" size="small">LOGIN</Button>
                }

                {/* Display BookShow button if enabled and user is loggedin to book movie*/}
                {enableBooking && isloggedIn ?
                    <Button className="btn" variant="contained" color="primary" size="small">BOOK SHOW 1 </Button> :
                    <div> </div>
                }

                {/* Display BookShow button if enabled for guest user to navigate to signup page */}
                {enableBooking && !isloggedIn ?
                    <Button className="btn" variant="contained" color="primary" size="small">BOOK SHOW 2</Button> :
                    <div> </div>
                }
                
            </div>


        </div>
    )
}