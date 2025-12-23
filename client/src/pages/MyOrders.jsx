import React from 'react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const {currency} = useAppContext();
  return (
    <div className='mt-16 pb-16'>
        <div className='flex flex-col items-end w-max mb-8'>
            <p className='text-2xl font-medium uppercase'>My Orders</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      
    </div>
  )
}

export default MyOrders
