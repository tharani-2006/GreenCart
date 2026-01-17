import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    //fetch seller status
    const fetchSellerStatus = async () => {
        try{
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        }catch(error){
            // Silently handle seller auth check errors
        }
    }

    //fetch user auth status, user data and cart items
    const fetchUser = async () => {
        try{
            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
                setIsInitialLoad(false);
            } else {
                setUser(null);
                setCartItems({});
                setIsInitialLoad(false);
            }
        }catch(error){
            const status = error.response?.status;
            if(status !== 401) {
                console.error("Error fetching user:", error);
            }
            setUser(null);
            setCartItems({});
            setIsInitialLoad(false);
        }
    }

    //fetch All products 
    const fetchProducts = async () => {
        try{
            const {data} = await axios.get('/api/product/all');
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    //Add Product to Cart
    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems)

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }

        setCartItems(cartData)
        
        if(user) {
            try {
                await axios.post('/api/user/add-to-cart', { itemId });
            } catch (error) {
                // Silently handle cart sync errors
            }
        }
        
        toast.success("Added to cart")
    }

    //update cart item Quantity
    const updateCartItem = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId] = quantity
        setCartItems(cartData)
        
        if(user) {
            try {
                await axios.post('/api/user/update-cart', { itemId, quantity });
            } catch (error) {
                // Silently handle cart sync errors
            }
        }
        
        toast.success("Cart updated")
    }

    //remove product from cart
    const removeFromCart = async (itemId) => {
        let cartData = structuredClone(cartItems)
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId]
            }
        }
        setCartItems(cartData)
        
        if(user) {
            try {
                await axios.post('/api/user/remove-from-cart', { itemId });
            } catch (error) {
                // Silently handle cart sync errors
            }
        }
        
        toast.success("Removed from cart")
    }
    
    //Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    //Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            const itemInfo = products.find((p) => p._id === item);
            if(cartItems[item] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[item];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(()=> {
        fetchProducts(),
        fetchUser(),
        fetchSellerStatus()
    },[])

    useEffect(()=> {
        if(isInitialLoad) {
            return;
        }

        const updateCart = async () => {
            try{
                const {data} = await axios.post('/api/cart/update', {userId: user._id, cartItems});
                if(data.success){
                    // Cart updated successfully
                }else{
                    if(data.message !== "Invalid token" && data.message !== "Unauthorized access"){
                        toast.error(data.message);
                    }
                }
            }catch(error){
                const errorMessage = error.response?.data?.message || error.message;
                if(errorMessage !== "Invalid token" && errorMessage !== "Unauthorized access"){
                    toast.error(errorMessage);
                }
            }
        }
        if(user && Object.keys(cartItems).length > 0){
            updateCart();
        }
    },[cartItems, user, isInitialLoad])

    const value = { navigate, user, setUser, isSeller, setIsSeller,
         showUserLogin, setShowUserLogin, products, setProducts,
        currency, addToCart, updateCartItem, removeFromCart, cartItems,
        searchQuery, setSearchQuery, getCartCount, getCartAmount,
        axios, fetchProducts, setCartItems, fetchUser,
    };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}