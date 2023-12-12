import React from 'react'
import { Link } from 'react-router-dom'

function Start() {
  return (
    <div className='row bg-white m-0 p-0'>
      <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
        <div className='pt-5 pt-md-0'>
          <h1>Live Chat</h1>
          <p>Lorem Ipsum is simply dummy text of the <br />printing and typesetting industry. Lorem Ipsum has been the industry's <br />standard dummy text ever since the 1500s, </p>
          <Link to="/public" className='btn btn-primary btn-lg rounded-pill me-2 mb-2 py-2 pill'>Start Public Chat <i className='ms-2 bi bi-chat fs-5'></i></Link>
          <Link to="/login" className='btn btn-success btn-lg rounded-pill py-2 pill'>Start Private Chat <i className='ms-2 bi bi-lock fs-5'></i></Link>
        </div>
      </div>
      <div className='col-12 col-md-6'>
        <img src="/images/start.jpg" alt="start-home-page" className='w-100' />
      </div>
    </div>
  )
}

export default Start