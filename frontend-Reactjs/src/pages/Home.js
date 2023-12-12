import React from 'react'
import { useParams } from 'react-router-dom';


function Home() {

    // reciver 
    const { receiver_id } = useParams();
    // Sender
    const user = JSON.parse(sessionStorage.getItem('user'));

    return (
        <div>
            <div className='text-center'>
                <img src='/images/start.jpg' className='w-50' />
            </div>
            <h4 className='text-center'>Messanger</h4>
        </div>
    )
}

export default Home