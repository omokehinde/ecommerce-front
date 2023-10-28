import { styled } from "styled-components";
import Link from "next/link";

import Button from "./Button";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div``;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    text-align: center; 
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    img{
        max-width: 100%;
        max-height: 80px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 0.9rem;
    color: inherit;
    text-decoration: none;
    margin: 0;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    @media screen and (min-width: 760px) {
        display: flex;
    }
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 400;
    text-align: right;
    @media screen and (min-width: 760px) {
        font-size: 1.2rem;
        font-weight: 600;
        text-align: left;
    }
`;

export default function ProductBox({_id, title, description, price, images }) {
    const url = "/product/"+_id;
    const {addProduct} = useContext(CartContext);
    return (
        <ProductWrapper key={_id}>
            <WhiteBox href={url}>
                <div>
                    <img src={images[0]} />
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>${price}</Price>
                    <Button primary={1} outline={1} onClick={()=>addProduct(_id)}>
                        Add to cart
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}