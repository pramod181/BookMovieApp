import React, { useState } from "react";
import './Header.css';
import companyLogo from '../../assets/logo.svg';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useHistory } from "react-router-dom";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function TabPanel(props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    );
}

//   tab functions/parameters

TabPanel.propTypes = {
    children: PropTypes.node.isRequired
};

export default function Header(props) {

    const enableBooking = props.enableBooking;
    const [isloggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("access-token") == null ? false : true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [bookShowRequested, setBookShowRequested] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameRequired, setUsernameRequired] = useState("dispNone");
    const [loginPasswordRequired, setLoginPasswordRequired] = useState("dispNone");
    const [loginPassword, setloginPassword] = useState("");
    const [firstnameRequired, setFirstnameRequired] = useState("dispNone");
    const [firstname, setFirstname] = useState("");
    const [lastnameRequired, setLastnameRequired] = useState("dispNone");
    const [lastname, setLastname] = useState("");
    const [emailRequired, setEmailRequired] = useState("dispNone");
    const [email, setEmail] = useState("");
    const [registerPasswordRequired, setRegisterPasswordRequired] = useState("dispNone");
    const [registerPassword, setRegisterPassword] = useState("");
    const [contactRequired, setContactRequired] = useState("dispNone");
    const [contact, setContact] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const history = useHistory();
    const ariaHideApp = false;


    // Parameters/functions for Modal

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {

    }

    function closeModal() {
        setIsOpen(false);
    }

    // Parameters/functions for Tabs

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };





    // LogOut Handler
    const logoutClickHandler = async()=>{

        try {
            fetch('http://localhost:8085/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': "no-cache",
                    Authorization : "Bearer " + sessionStorage.getItem("access-token")
                }
            }).then((rawResponse)=>{
                window.sessionStorage.removeItem("user-details");
                window.sessionStorage.removeItem("access-token");
                setIsLoggedIn(false);
            }).catch((e)=>{
                const error = new Error();
                error.message = 'Something went wrong';
                throw error;
            });

        } catch (e) {

            alert('Error: ' + e.message);
            console.log(e);
        }
    };

    // Login Handler
    const inputUsernameChangeHandler = (e) => {
        setUsername(e.target.value);
    }

    const inputLoginPasswordChangeHandler = (e) => {
        setloginPassword(e.target.value);
    }

    const loginClickHandler = async () => {
        username === "" ? setUsernameRequired("dispBlock") : setUsernameRequired("dispNone");
        loginPassword === "" ? setLoginPasswordRequired("dispBlock") : setLoginPasswordRequired("dispNone");

        if (username && loginPassword) {

            const loginParams = window.btoa(username + ":" + loginPassword);

            try {
                const rawResponse = await fetch('http://localhost:8085/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': "no-cache",
                        authorization: 'Basic ' + loginParams
                    }
                });

                const result = await rawResponse.json();

                if (rawResponse.ok) {
                    window.sessionStorage.setItem("user-details", result.id);
                    window.sessionStorage.setItem("access-token", rawResponse.headers.get("access-token"));
                    setIsLoggedIn(true);

                    setTimeout(() => {
                        closeModal();
                    }, 2000);

                    if (bookShowRequested) {
                        history.push('/bookshow/' + props.id);
                        setBookShowRequested(false);
                    }

                } else {
                    const error = new Error();
                    error.message = result.message || 'Something went wrong';
                    throw error;
                }


            } catch (e) {
                alert('Error: ' + e.message);
            }


        }

    }

    // Register Handler

    const inputFirstNameChangeHandler = (e) => {
        setFirstname(e.target.value);
    }

    const inputLastNameChangeHandler = (e) => {
        setLastname(e.target.value);
    }

    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const inputRegisterPasswordChangeHandler = (e) => {
        setRegisterPassword(e.target.value);
    }

    const inputContactChangeHandler = (e) => {
        setContact(e.target.value);
    }

    async function registerClickHandler() {
        firstname === "" ? setFirstnameRequired("dispBlock") : setFirstnameRequired("dispNone");
        lastname === "" ? setLastnameRequired("dispBlock") : setLastnameRequired("dispNone");
        email === "" ? setEmailRequired("dispBlock") : setEmailRequired("dispNone");
        registerPassword === "" ? setRegisterPasswordRequired("dispBlock") : setRegisterPasswordRequired("dispNone");
        contact === "" ? setContactRequired("dispBlock") : setContactRequired("dispNone");

        if (firstname && lastname && email && registerPassword && contact) {
            let registerParam = {
                "email_address": email,
                "first_name": firstname,
                "last_name": lastname,
                "mobile_number": contact,
                "password": registerPassword
            };

            try {
                const rawResponse = await fetch('http://localhost:8085/api/v1/signup', {
                    body: JSON.stringify(registerParam),
                    method: 'POST',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                });

                const result = await rawResponse.json();

                if (rawResponse.ok) {
                    setRegistrationSuccess(true);
                    alert('user registered');

                    setTimeout(() => {
                        setValue(0);
                        setFirstname('');
                        setLastname('');
                        setEmail('');
                        setContact('');
                        setRegisterPassword('');
                        setRegistrationSuccess(false);
                    }, 2000);

                } else {
                    const error = new Error();
                    error.message = result.message || 'Something went wrong';
                    throw error;
                }
            } catch (e) {
                alert('Error: ' + e.message);
            }
        }

    }

    // Booking

    const bookingHandler = () => {
        history.push('/bookshow/' + props.id);
    }

    const guestBookingHandler = () => {
        setBookShowRequested(true);
        openModal();
    }



    return (
        <div className="header">
            <img className="logo" src={companyLogo} alt="company logo">
            </img>
            <div>

                {/* Display Login/LogOut button as per login status */}
                {isloggedIn ?
                    <Button className="btn" variant="contained" size="small" style={{margin : "2px 10px"}} onClick={logoutClickHandler}>LOGOUT</Button> :
                    <Button className="btn" variant="contained" size="small" style={{margin : "2px 10px"}} onClick={openModal}>LOGIN</Button>
                }
                

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp = {ariaHideApp}
                >
                    <div >
                        <Tabs value={value} onChange={handleChange} >
                            <Tab label="LOGIN" />
                            <Tab label="REGISTER" />
                        </Tabs>
                        {value === 0 ?
                            <TabPanel value={value} index={0}>
                                <FormControl required>
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input id="username" type="text" username={username} onChange={inputUsernameChangeHandler} />
                                    <FormHelperText className={usernameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                    <Input id="loginPassword" type="password" loginpassword={loginPassword} onChange={inputLoginPasswordChangeHandler} />
                                    <FormHelperText className={loginPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {isloggedIn ?
                                    <FormControl>
                                        <span className="successText">
                                            Login Successful!
                                        </span>
                                    </FormControl> :
                                    <div></div>
                                }
                                <br />
                                <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                            </TabPanel> :
                            <div></div>
                        }
                        {value === 1 ?
                            <TabPanel value={value} index={1}>
                                <FormControl required>
                                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                                    <Input id="firstname" type="text" firstname={firstname} onChange={inputFirstNameChangeHandler} />
                                    <FormHelperText className={firstnameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                    <Input id="lastname" type="text" lastname={lastname} onChange={inputLastNameChangeHandler} />
                                    <FormHelperText className={lastnameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="email" email={email} onChange={inputEmailChangeHandler} />
                                    <FormHelperText className={emailRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                    <Input id="registerPassword" type="password" registerpassword={registerPassword} onChange={inputRegisterPasswordChangeHandler} />
                                    <FormHelperText className={registerPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                    <Input id="contact" type="tel" contact={contact} onChange={inputContactChangeHandler} />
                                    <FormHelperText className={contactRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {registrationSuccess === true &&
                                    <FormControl>
                                        <span className="successText">
                                            Registration Successful. Please Login!
                                        </span>
                                    </FormControl>
                                }
                                <br />
                                <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                            </TabPanel> :
                            <div></div>
                        }
                    </div>

                </Modal>

                {/* Display BookShow button if enabled and user is loggedin to book movie*/}
                {enableBooking && isloggedIn ?
                    <Button className="btn" variant="contained" color="primary" size="small" style={{margin : "2px 10px"}} onClick={bookingHandler}>BOOK SHOW</Button> :
                    <div> </div>
                }

                {/* Display BookShow button if enabled for guest user to navigate to signup page */}
                {enableBooking && !isloggedIn ?
                    <Button className="btn" variant="contained" color="primary" size="small" style={{margin : "2px 10px"}} onClick={guestBookingHandler}>BOOK SHOW</Button> :
                    <div> </div>
                }

            </div>


        </div>
    )
}