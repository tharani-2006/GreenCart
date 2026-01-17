import React from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Loading = () => {

    const { navigate } = useAppContext();

    // get 'my-orders' from query params
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl = query.get('next');

    useEffect(() => {
        if (nextUrl) {
            // navigate to the nextUrl after 3 seconds  
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 3000);
        }
    }, [nextUrl]);

    return (
        <div className='flex justify-center items-center h-screen'>
            {/* for animation spin */}
            <div
            className='animate-spin rounded-full 
            h-24 w-24
            border-4 border-gray-300 
            border-t-primary'
            >

            </div>
        </div>
    )
}

export default Loading
