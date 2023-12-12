import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getRoomMessage } from '../api/Index';
import './publicChat.css';
import Dropzone from '../components/Dropzone';
function Chat() {

    var sender = JSON.parse(sessionStorage.getItem('user'));
    const [receiver, setReceiver] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const { room_id } = useParams();
    const [ws, setWs] = useState(null);

    const { receiver_id } = useParams();
    const chatContainerRef = useRef(null);

    // Set Reciver
    useEffect(() => {
        setReceiver(JSON.parse(sessionStorage.getItem('receiver')));
        sender = JSON.parse(sessionStorage.getItem('user'));
    }, [receiver_id])


    // Get Room Messages

    useEffect(() => {
        const room_user = { 'senderId': sender._id, 'receiverId': receiver_id }
        getRoomMessage(room_user, '/getmessages/')
            .then((response) => {
                setChatHistory(response.data);
            })
            .catch((error) => {
                console.error('failed', error);
            });
    }, [receiver_id])

    // Scroll Bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, chatHistory]);




    // Web Soket Get Messages

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

    // send Message
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (message) {
                sendme();
            }
        }
    };

    const sendme = () => {
        const newMessage = {
            text: message,
            sender: sender._id,
            recipient: receiver._id,
            room_id: room_id,
            timestamp: new Date().toISOString(),
        };
        socket.send(JSON.stringify(newMessage));
        setMessage('');
    }

    // Model
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [showFileUrl, SetshowFileUrl] = useState('');
    const openImageModal = (url) => {
        setShowImageModal(true); SetshowFileUrl(url);
    }
    const closeImageModal = () => setShowImageModal(false);

    // File Upload
    const handleDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                const newMessage = {
                    text: base64String,
                    sender: sender._id,
                    recipient: receiver._id,
                    room_id: room_id,
                    timestamp: new Date().toISOString(),
                };
                socket.send(JSON.stringify(newMessage));
            };
            reader.readAsDataURL(file);
        });
        closeModal();
    };

    function isBase64ImageURL(inputString) {
        if (inputString)
            return inputString.startsWith('data:image/');
        else
            return false;
    }

    function isPDF(inputString) {
        if (inputString)
            return inputString.startsWith('data:application/');
        else
            return false;
    }


    return (
        <section>
            <div className='d-flex justify-content-between align-items-center py-3 border-bottom ps-3 pe-4'>
                <div className='d-flex align-items-center'>
                    <div className='mx-2 ms-4'>
                        <img src={receiver ? (receiver.profile ? receiver.profile : '/images/user.jpeg') : '/images/user.jpeg'} alt="" width="32" height="32" className="rounded-circle me-2" />                    </div>
                    <div style={{ lineHeight: "15px" }}>
                        <p className='mb-0'>{receiver && receiver.name}</p>
                        <span className='text-muted' style={{ fontSize: "10px" }}>{receiver && receiver.email}</span>
                    </div>
                </div>
                <div>
                    <i className='bi bi-search'></i>
                </div>
            </div>
            <div style={{ height: "80vh", overflowY: "auto" }} className='ps-3 pe-5 hidescroll pt-3' ref={chatContainerRef}>
                {
                    chatHistory ? (
                        chatHistory.map((message, index) => (
                            <div key={index} className={`d-flex ${message.user_id === sender._id ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`d-flex py-2 align-items-center alert ${isBase64ImageURL(message.content) ? 'w-25' : ''} ${message.user_id === sender._id ? 'alert-dark' : 'alert-light'} py-0 pe-5`} style={{ width: "fit-content" }}>
                                    <div>
                                        {
                                            message.user_id === sender._id && <img src={sender ? (sender.profile ? sender.profile : '/images/user.jpeg') : '/images/user.jpeg'} alt="" width="32" height="32" className="rounded-circle me-2" />
                                        }{
                                            message.user_id === receiver._id && <img src={receiver ? (receiver.profile ? receiver.profile : '/images/user.jpeg') : '/images/user.jpeg'} alt="" width="32" height="32" className="rounded-circle me-2" />
                                        }
                                    </div>
                                    <div style={{ lineHeight: "22px" }}>
                                        {
                                            isBase64ImageURL(message.content) ? (
                                                <img onClick={() => { openImageModal(message.content) }} src={message.content} className='w-100' />
                                            ) : (
                                                isPDF(message.content) ? (
                                                    <>
                                                        <iframe src={message.content}></iframe><br /><br />
                                                        <button className='btn btn-primary' onClick={() => openImageModal(message.content)}><i className='bi bi-eye'> View Pdf</i></button>
                                                    </>
                                                ) : (
                                                    <p className='pb-0 mb-0'>{message.content} </p>
                                                )
                                            )
                                        }
                                        <p className='text-muted pb-0 mb-0 text-end' style={{ fontSize: '10px' }}>{new Date(message.timestamp).toISOString().split('T')[1].split('.')[0]} {message.recipient}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : "Loading"
                }
                {
                    messages.map((message, index) => (
                        message.room_id == room_id ? (
                            <div key={index} className={`d-flex ${message.sender === sender._id ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`d-flex py-2 align-items-center alert ${isBase64ImageURL(message.content) ? 'w-25' : ''} ${message.sender === sender._id ? 'alert-dark' : 'alert-light'} py-0 pe-5`} style={{ width: "fit-content" }}>
                                    <div>
                                        {
                                            message.sender === sender._id && <img src={sender ? (sender.profile ? sender.profile : '/images/user.jpeg') : '/images/user.jpeg'} alt="" width="32" height="32" className="rounded-circle me-2" />
                                        }
                                        {
                                            message.recipient !== receiver._id && <img src={receiver ? (receiver.profile ? receiver.profile : '/images/user.jpeg') : '/images/user.jpeg'} alt="" width="32" height="32" className="rounded-circle me-2" />
                                        }
                                    </div>
                                    <div style={{ lineHeight: "22px" }}>
                                        {
                                            message.text && (
                                                isBase64ImageURL(message.text) ? (
                                                    <img onClick={() => { openImageModal(message.text) }} src={message.text} className='w-100' />
                                                ) : (
                                                    isPDF(message.text) ? (
                                                        <>
                                                            <iframe src={message.text}></iframe><br /><br />
                                                            <button className='btn btn-primary' onClick={() => openImageModal(message.text)}><i className='bi bi-eye'> View Pdf</i></button>
                                                        </>
                                                    ) : (
                                                        <p className='pb-0 mb-0'>{message.text} </p>
                                                    )
                                                )
                                            )
                                        }
                                        <p className='text-muted pb-0 mb-0 text-end' style={{ fontSize: '10px' }}>{new Date(message.timestamp).toISOString().split('T')[1].split('.')[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ) : ""
                    ))}
            </div>
            <div className='bottom-0 d-flex justify-content-center align-items-center pb-2 pe-3' style={{ width: "-webkit-fill-available", position: "absolute" }}>
                <div className='d-flex'>
                    <i className='bi bi-emoji-smile mx-3 fs-4'></i>
                    <i className='bi bi-file-earmark-arrow-up mx-3 fs-4' onClick={openModal}></i>
                </div>
                <div className='form-group w-100 position-relative'>
                    <input className='form-control rounded-0 py-2' value={message} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                    <i className='bi bi-send position-absolute' style={{ right: "15px", top: "10px" }}></i>
                </div>
            </div>

            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal Title</h5>
                            <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <Dropzone onDrop={handleDrop} />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`modal-backdrop fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none' }}
            ></div>

            <div className={`modal ${showImageModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showImageModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-fullscreen" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{receiver && receiver.name}</h5>
                            <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={closeImageModal}></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            {
                                isBase64ImageURL(showFileUrl) ? (
                                    <img src={showFileUrl} />
                                ) : isPDF(showFileUrl) ? (
                                    <iframe src={showFileUrl} className='w-100' ></iframe>
                                ) : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`modal-backdrop fade ${showImageModal ? 'show' : ''}`}
                style={{ display: showImageModal ? 'block' : 'none' }}
            ></div>

        </section >
    )
}

export default Chat