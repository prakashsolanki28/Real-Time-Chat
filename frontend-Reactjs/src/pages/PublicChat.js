import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './publicChat.css';

function PublicChat() {

    const [name, setName] = useState('');
    const { username } = useParams();
    const { chatid } = useParams();
    const { joinchat } = useParams();
    const navigate = useNavigate();


    const [messages, setMessages] = useState([]);
    const [chat_id, setChatId] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [ws, setWs] = useState(null);

    const socket = new WebSocket("ws://localhost:8086");
    useEffect(() => {
        socket.onopen = () => {
            console.log("WebSocket connection opened");
            setWs(socket);
        };

        socket.onmessage = (event) => {
            setMessages([...messages, JSON.parse(event.data)]);
            console.log(event.data);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [messages]);

    const handleSendMessage = () => {
        const message = {
            uuid: chatid,
            text: messageInput,
            sender: username,
        };
        socket.send(JSON.stringify(message));
        setMessageInput("");
    };

    const startChatHandler = () => {
        if (name) {
            const numbers = Math.floor(Math.random() * 90000) + 10000; //  10000 and 99999
            const characters = Math.random().toString(36).substring(2, 5); // Generates 3 random characters
            const chatid_ = `${numbers}${characters}`;
            const url = `/public/${name}/${chatid ? chatid : chatid_}`;
            navigate(url)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (messageInput) {
                handleSendMessage();
                setMessageInput('');
            }
        }
    };

    return (
        <div>
            {
                chatid ? (
                    username ? (
                        <>
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <div className="container-fluid">
                                    <a className="navbar-brand" href="#">Messanger</a>
                                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                            <li className="nav-item">
                                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Private Chat
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                                    <li><Link className="dropdown-item" to="/register">Register</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <form className="d-flex">
                                            <button className='btn btn-primary rounded-0 disabled'>Invaite</button>
                                            <input className="form-control me-2 rounded-0" style={{ width: "fit-content" }} value={`http://localhost:3000/public/77341c25`} />
                                        </form>
                                    </div>
                                </div>
                            </nav>
                            <div className="container-fluid chat-container">
                                <div className="row messages pt-3" style={{ overflow: 'auto' }}>
                                    {messages.map((message, index) => (
                                        <div key={index} className={message.sender === username ? `text-end` : `text-start`}>
                                            <div className="alert alert-light">
                                                {message.sender} : {message.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex input-container">
                                    <input type="text" value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyDown} className="form-control rounded-0" placeholder="Type your message..." />
                                    <button onClick={handleSendMessage} className="btn btn-primary rounded-0">Send</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='row p-0 m-0'>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <form className='pt-5 pt-md-0'>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="" onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Enter Your Name" />
                                        <span className="invalid-feedback">Name is Required</span>
                                    </div>
                                    <button type='button' className='btn btn-primary' disabled={name === ''} onClick={startChatHandler} >Start</button>
                                </form>
                            </div>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <img src="/images/start.jpg" alt="start-home-page" className='w-100' />
                            </div>
                        </div>
                    )
                ) : (
                    joinchat ? (
                        <div className='row p-0 m-0'>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <form className='pt-5 pt-md-0'>
                                    <div className="mb-3">
                                        <label className="form-label">Chat Id</label>
                                        <input type="text" name="" onChange={(e) => setChatId(e.target.value)} className="form-control mb-1" placeholder="Enter Chat Id" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="" onChange={(e) => setName(e.target.value)} className="form-control mb-1" placeholder="Enter your name" />
                                    </div>
                                    {
                                        chat_id === '' || name === '' ? (
                                            <button type='button' className='btn btn-primary' disabled={name === ''}>Start</button>
                                        ) : (
                                            <Link to={`/public/${name}/${chat_id}`} className='btn btn-primary' disabled={name === ''}>Start</Link>
                                        )
                                    }
                                </form>
                            </div>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <img src="/images/start.jpg" alt="start-home-page" className='w-100' />
                            </div>
                        </div>
                    ) : (
                        <div className='row p-0 m-0'>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <form className='pt-5 pt-md-0'>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="" onChange={(e) => setName(e.target.value)} className="form-control mb-1" placeholder="Enter Your Name" />
                                        <span className="invalid-feedback">Name is Required</span>
                                        <Link className='text-decoration-none' to={"/public/join/joinchat"}>Join Chat using Chat id</Link><br />
                                    </div>
                                    <button type='button' className='btn btn-primary' disabled={name === ''} onClick={startChatHandler} >Start</button>
                                </form>
                            </div>
                            <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
                                <img src="/images/start.jpg" alt="start-home-page" className='w-100' />
                            </div>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default PublicChat