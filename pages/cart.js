import { styled } from "styled-components";
import {useContext, useEffect, useState} from 'react';

import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Table from "@/components/Table";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Input from "@/components/Input";


const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 760px) {
        grid-template-columns: 1.3fr 0.7fr;
    }
    gap: 40px; 
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 760px) {
        width: 100px;
        height: 100px;
        padding: 10px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QunatityLabel = styled.span`
    padding: 0 3px;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const {cartProducts, addProduct, 
        removeProduct, clearCart} 
        = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && cartProducts.length > 0) {
            axios.post("/api/cart/", {ids:cartProducts})
                .then(response=>{
                    setProducts(response.data);
            });
        } else {
            setProducts([]);
        }
    },[cartProducts]);

    useEffect(() => {
        // Only run this effect on the client side
        if (typeof window !== 'undefined' && window.location.href.includes('success')) {
            // This will set products to an empty array when the component mounts
            clearCart();
            setIsSuccess(true);
        }
    }, []);

    function increaseProductQty(id) {
        addProduct(id);
    }
    
    function decreaseProductQty(id) {
        removeProduct(id);
    }

    async function goToPayment() {
        const response = await axios.post('api/checkout', {
            name,email,city,postalCode,streetAddress,country,cartProducts
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }
    
    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p=>p._id===productId)?.price || 0;
        total += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <Box>
                        <h1>Thanks for shopping.</h1>
                        <p>Your order will be delivered soon.</p>
                    </Box>
                </Center>
            </>
        );
    }
    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        <h2>Cart</h2>
                        {products.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product=>(
                                <tr>
                                    <ProductInfoCell>
                                        <ProductImageBox>
                                            <img src={product.images[0]} />
                                        </ProductImageBox>
                                        {product.title}
                                    </ProductInfoCell>
                                    <td>
                                        <Button onClick={()=>
                                            decreaseProductQty(product._id)}>
                                            -
                                        </Button>
                                        <QunatityLabel>
                                            {cartProducts
                                                .filter(id => id === product._id).length}
                                            <Button onClick={()=>
                                                increaseProductQty(product._id)}>
                                                +
                                            </Button>
                                        </QunatityLabel>
                                    </td>
                                    <td>${product.price *
                                        cartProducts
                                        .filter(id => id === product._id).length}</td>
                                </tr>
                                    ))}
                                    <tr>
                                        <td>Total</td>
                                        <td></td>
                                        <td>${total}</td>
                                    </tr>
                            </tbody>
                        </Table>
                        )}
                    </Box>
                    <Box>
                        {!!cartProducts?.length && (
                            <Box>
                                <h2>Order Information</h2>
                                <Input type="text" placeholder="Name" value={name} 
                                    name="name"
                                    onChange={ev=>setName(ev.target.value)}/>
                                <Input type="email" placeholder="Email" value={email}
                                    name="email" 
                                    onChange={ev=>setEmail(ev.target.value)}/>
                                <CityHolder>
                                <Input type="text" placeholder="City" value={city}
                                    name="city"
                                    onChange={ev=>setCity(ev.target.value)}/>
                                <Input type="text" placeholder="Postal code" 
                                    value={postalCode} 
                                    name="postalCode"
                                    onChange={ev=>setPostalCode(ev.target.value)}/>
                                </CityHolder>
                                <Input type="text" placeholder="Street Address"
                                    value={streetAddress} 
                                    name="streetAddress"
                                    onChange={ev=>setStreetAddress(ev.target.value)}/>
                                <Input type="text" placeholder="Country" 
                                    value={country} 
                                    name="country"
                                    onChange={ev=>setCountry(ev.target.value)}/>
                                <Button black={1} block={1} type="submit"
                                    onClick={goToPayment}>
                                    Make payment
                                </Button>
                            </Box>
                        )}
                    </Box>
                </ColumnsWrapper>
            </Center>
        </>
    );
}