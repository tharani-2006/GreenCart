import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const SellerLogin = () => {

    const { isSeller, setIsSeller, navigate } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSeller(true);
    }

    useEffect(() => {
        if (isSeller) {
            navigate('/seller');
        }   
    }, [isSeller]);

    return !isSeller && (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600' >

                <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 '>
                    <p className='text-2xl font-medium m-auto'><span className='text-primary'>Selller</span> Login</p>
                </div>
                <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 '>
                    <label className='flex flex-col gap-1 w-full'>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary' />
                    </label>
                    <label className='flex flex-col gap-1 w-full'>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary' />
                    </label>
                    <button type="submit" className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition duration-300'>Login</button>
                </div>
        </form>
    )
}

export default SellerLogin
