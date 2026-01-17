import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets, dummyAddress } from '../assets/assets';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const { products, setCartItems, user, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios } = useAppContext();
    const location = useLocation();
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    }

    const getUserAddress = async () => {
        // Only fetch addresses if user is authenticated
        if (!user || !user._id) {
            return;
        }

        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                const fetchedAddresses = data.addresses || [];
                setAddresses(fetchedAddresses);
                // Always set the first address as selected if addresses exist
                if (fetchedAddresses.length > 0) {
                    // Use functional update to check current selectedAddress state
                    setSelectedAddress(prev => {
                        // If no address is currently selected, or if the selected address is not in the list, select the first one
                        if (!prev || !fetchedAddresses.find(addr => addr._id === prev._id)) {
                            return fetchedAddresses[0];
                        }
                        return prev; // Keep the current selection if it's still valid
                    });
                } else {
                    setSelectedAddress(null);
                }
            } else {
                // Don't show toast for auth errors, just log them silently
                if(data.message !== "Invalid token" && data.message !== "Unauthorized access" && data.message !== "Token expired"){
                    toast.error(data.message);
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            const status = error.response?.status;
            
            // Silently handle auth errors - they're expected if user is not authenticated or token is invalid
            if(status === 401) {
                // Token might be expired or invalid - don't spam console with errors
                // The user will need to login again
                return;
            }
            
            // Only show toast for non-auth errors
            if(errorMessage !== "Invalid token" && errorMessage !== "Unauthorized access" && errorMessage !== "Token expired"){
                toast.error(errorMessage);
            }
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                toast.error("Please select an address");
                return;
            }
            //place order with COD
            if (paymentOption === "COD") {
                try {
                    const { data } = await axios.post('/api/order/cod', {
                        userId: user._id,
                        items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                        address: selectedAddress._id
                    });

                    if (data.success) {
                        toast.success(data.message);
                        setCartItems({});
                        navigate('/my-orders');
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            } else {
                //place order with Online Payment
                // Check minimum amount for Stripe (₹0.50)
                const totalAmount = getCartAmount() + (getCartAmount() * 0.02);
                if (totalAmount < 0.50) {
                    toast.error("Minimum order amount for online payment is ₹0.50");
                    return;
                }

                try {
                    const { data } = await axios.post('/api/order/stripe', {
                        userId: user._id,
                        items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                        address: selectedAddress._id
                    });

                    if (data.success) {
                        //redirect to stripe checkout
                        window.location.replace(data.url);
                    } else {
                        toast.error(data.message);
                    }
                }
                catch (error) {
                    const errorMessage = error.response?.data?.message || error.message;
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [cartItems, products]);

    useEffect(() => {
        // Only fetch addresses if user is logged in, has a valid ID, and we're on the cart page
        if (user && user._id && location.pathname === '/cart') {
            getUserAddress();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, location.pathname]) // Refresh when user changes or when navigating to cart page

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0);
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={e => updateCartItem(product._id, Number(e.target.value))} value={cartItems[product._id]} className='outline-none'>
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className='inlint-block w-6 h-6' />
                        </button>
                    </div>)
                )}

                <button onClick={() => { navigate("/products"); scrollTo(0, 0); }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className='group-hover:-translate-x-1 transition' src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedAddress 
                                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` 
                                : addresses.length > 0 
                                    ? "Please select an address" 
                                    : "No address found"}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            {addresses.length > 0 ? "Change" : "Add"}
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 left-0 right-0 z-10 py-1 bg-white border border-gray-300 text-sm shadow-lg rounded">
                                {addresses.length > 0 ? (
                                    addresses.map((address, index) => (
                                        <p 
                                            key={address._id || index} 
                                            onClick={() => { 
                                                setSelectedAddress(address); 
                                                setShowAddress(false);
                                            }} 
                                            className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {address.street}, {address.city}, {address.state}, {address.country}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-500 p-2 text-center">No addresses saved</p>
                                )}
                                <p onClick={() => { navigate("/add-address"); setShowAddress(false); }} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 border-t border-gray-200">
                                    {addresses.length > 0 ? "Add new address" : "Add address"}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount() * 0.02}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency}{getCartAmount() + (getCartAmount() * 0.02)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Pay"}
                </button>
            </div>
        </div>
    ) : null
}


export default Cart;