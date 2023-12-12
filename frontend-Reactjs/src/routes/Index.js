import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Auth Page
import Login from '../pages/Login';
import Register from '../pages/Register';
import Logout from '../pages/Logout';
// Middlware
import TokenCheckMiddleware from '../middleware/TokenCheckMiddleware';
import AuthCheckMiddleware from '../middleware/AuthCheckMiddleware';
// Pages
import Home from '../pages/Home';
import Start from '../pages/Start';
import PublicChat from '../pages/PublicChat';
import Sidebar from '../components/Sidebar';
import Chat from '../pages/Chat';

function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Start />} />
                <Route path='/logout' element={<TokenCheckMiddleware><Logout /></TokenCheckMiddleware>} />
                <Route path='/public' element={<PublicChat />} />
                <Route path='/public/:username/:chatid' element={<PublicChat />} />
                <Route path='/public/:chatid' element={<PublicChat />} />
                <Route path='/public/join/:joinchat' element={<PublicChat />} />
                <Route path='/home' element={<Sidebar><Home /></Sidebar>} />
                <Route path='/home/chat/:receiver_id/:room_id' element={<Sidebar><Chat /></Sidebar>} />
            </Routes>
        </BrowserRouter>
    )
}
export default Index