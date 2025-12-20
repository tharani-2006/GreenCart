import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'

//Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition' type={type} placeholder={placeholder} name={name} onChange={handleChange} value={address[name]} />
)


const AddAddress = () => {

    const [address, setAddress] = useState({
        firstname: '',
        lastname: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        //form submit logic
    }

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>

            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className=' flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div>
                            <InputField handleChange={handleChange} address={address} name='firstname' type='text' placeholder='First Name' />
                            <InputField handleChange={handleChange} address={address} name='lastname' type='text' placeholder='Last Name' />

                        </div>
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add Address" />
            </div>
        </div>
    )
}

export default AddAddress
