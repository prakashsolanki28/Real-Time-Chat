import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateData, searchUser, getUserRooms } from '../api/Index';


function Sidebar({ children }) {

    const navigate = useNavigate();
    // Sender
    const user = JSON.parse(sessionStorage.getItem('user'));
    // Get Rooms Data   
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const getRooms = async () => {
            const rooms = await getUserRooms('/userrooms/' + user._id);
            setRooms(rooms.data);
        }
        getRooms();
    }, [user]);

    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        file: '',
        user_id: user._id
    });

    const activeChatHandler = (receiver, roomid) => {
        sessionStorage.setItem('receiver', JSON.stringify(receiver));
        const url = `/home/chat/${receiver._id}/${roomid}`;
        navigate(url);
    }

    // Search User
    const [startChatUser, setStartChatUser] = useState([]);
    const [query, setQuery] = useState('');
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        const queryData = { query: value };
        searchUser(queryData, '/searchuser')
            .then((response) => {
                setStartChatUser(response.data);
            })
            .catch((error) => {
                console.error('Registration failed', error);
            });
    };

    // Data Update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, });
    };

    const handleDataUpdate = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataUrl = e.target.result;
                setImageDataUrl(dataUrl);
                setFormData({ ...formData, file: dataUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveChnages = () => {
        console.log(formData)
        updateData(formData, '/updatedata')
            .then((response) => {
                console.log('Update successful');
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
            })
            .catch((error) => {
                console.error('Registration failed', error);
            });
    }

    function isBase64ImageURL(inputString) {
        return inputString.startsWith('data:image/');
    }

    function isPDF(inputString) {
        return inputString.startsWith('data:application/');
    }

    const [sidebar, setSidebar] = useState(false);
    return (
        <div className="container-fluid mx-0 px-0" style={{ height: "100vh", overflow: 'hidden' }} >
            {
                sidebar ? (
                    <button onClick={() => setSidebar(!sidebar)} className='mt-3 btn btn position-absolute d-block d-md-none'>
                        <i className='bi bi-list'></i>
                    </button>
                ) : (
                    <button onClick={() => setSidebar(!sidebar)} className='mt-3 btn btn position-absolute d-block d-md-none'>
                        <i className='bi bi-list'></i>
                    </button>
                )
            }
            <div className="d-flex">
                <div className={`sidebar ${sidebar ? '' : 'd-none'} d-md-block`}>
                    <div className={`d-flex flex-column flex-shrink-0 p-3 border-end`} style={{ width: "280px", height: "100vh" }}>
                        <div className="w-100 d-flex justify-content-between align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
                            {sidebar ? <br></br> : ''}
                            < span className="fs-4">Chats</span> <button className='btn btn-link' data-bs-toggle="modal" data-bs-target="#chatSearchModel"><i className='bi bi-pencil'></i></button>
                        </div>
                        <hr />
                        <div className="list-group mb-auto" >
                            {
                                rooms.map((room) => (
                                    room.members.map((member) => (
                                        member._id !== user._id ? (
                                            <button onClick={() => activeChatHandler(member, room._id)} key={member._id} type="button" className='list-group-item list-group-item-action border py-2 rounded mb-2'>
                                                <div className='d-flex align-items-center'>
                                                    <div className='mx-2'>
                                                        {
                                                            <img src={member ? (member.profile ? (member.profile) : ('/images/user.jpeg')) : ('/images/user.jpeg')} alt="" width="32" height="32" className="rounded-circle me-2" />
                                                        }
                                                    </div>
                                                    <div style={{ lineHeight: "15px" }}>
                                                        <p className='mb-0'>{member.name}</p>
                                                        <span className='text-muted' style={{ fontSize: "10px" }}>{isBase64ImageURL(room.lastMessage.content) ? 'file Share' : isPDF(room.lastMessage.content) ? 'Pdf Share' : room.lastMessage.content.startsWith('data:') ? 'file' : room.lastMessage.content}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : ""
                                    ))
                                ))
                            }
                        </div>
                        <hr />
                        <div className="dropdown">
                            <div className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                {
                                    <img src={user ? (user.profile ? (user.profile) : (`/images/user.jpeg`)) : (`/images/user.jpeg`)} alt="" width="32" height="32" className="rounded-circle me-2" />
                                }
                                <strong>{user && user.name}</strong>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow px-3" aria-labelledby="dropdownUser1">
                                <li><button className='nav-link' data-bs-toggle="modal" data-bs-target="#exampleModal" >Setting</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className='nav-link' to="/logout">Logout</Link></li>
                            </ul>
                        </div>
                        <div className="modal fade" id="chatSearchModel" tabIndex="-1" aria-labelledby="chatSearchModelLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="chatSearchModelLabel">Start Chat</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">Search Name</label>
                                                <input type="text" name="" id="" onChange={handleSearchChange} value={query} className="form-control" placeholder="Search..." />
                                            </div>
                                            <div className='list-group w-100'>
                                                {startChatUser.map((search_user) => (
                                                    search_user._id !== user._id ? (
                                                        <button onClick={() => activeChatHandler(search_user)} key={search_user._id} type="button" className="list-group-item list-group-item-action border w-100 py-2 nav-item rounded">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <div className='d-flex'>
                                                                    <div className='mx-2'>
                                                                        {
                                                                            <img src={search_user ? (search_user.profile ? (search_user.profile) : (`/images/user.jpeg`)) : (`/images/user.jpeg`)} alt="" width="32" height="32" className="rounded-circle me-2" />
                                                                        }
                                                                    </div>
                                                                    <div style={{ lineHeight: "15px" }}>
                                                                        <p className='mb-0'>{search_user.name}</p>
                                                                        <span className='text-light' style={{ fontSize: "10px" }}>{search_user.email}</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <i className='bi bi-chevron-right'></i>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ) : ("")
                                                ))}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-fullscreen">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Setting</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div>
                                                {
                                                    formData.file ? (
                                                        <img src={`${formData.file}`} style={{ width: "200px" }} />
                                                    ) : ""
                                                }
                                                <p>Selected File</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Profile Picture</label>
                                                <input type="file" onChange={handleDataUpdate} className="form-control" name="file" id="file" placeholder="" aria-describedby="fileHelpId" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Name</label>
                                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} aria-describedby="fileHelpId" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} aria-describedby="fileHelpId" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={saveChnages}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <main className="w-100">
                    {children}
                </main>
            </div>
        </div >
    )
}

export default Sidebar