import React, { useEffect } from 'react';
import { Container, Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Divider from '../../components/divider';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { setChoosenProduct, setRestaurant } from './slice';
import { Product } from '../../../lib/types/products';
import { Member } from '../../../lib/types/member';
import { retrieveChoosenProduct, retrieveRestaurant } from './selector';
import { useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import MemberService from '../../services/MemberService';
import { useDispatch, useSelector } from 'react-redux';
import { serverApi } from '../../../lib/config';
import { CartItem } from '../../../lib/types/search';

// slice
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChoosenProduct: (data: Product) => dispatch(setChoosenProduct(data)),
});

// selector
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
);

const chosenProductRetriever = createSelector(
  retrieveChoosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

interface ProductPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ProductPageProps) {
  const { onAdd } = props;
  const { setChoosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { productId } = useParams<{ productId: string }>();
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const product = new ProductService();
  const member = new MemberService();
  useEffect(() => {
    product
      .getProduct(productId)
      .then((data) => setChoosenProduct(data))
      .catch((err) => console.log(err));

    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;
  return (
    <div className={'chosen-product'}>
      <Box className={'title'}>Product Detail</Box>
      <Container className={'product-container'}>
        <Stack className={'chosen-product-slider'}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img className="slider-image" src={imagePath} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={'chosen-product-info'}>
          <Box className={'info-box'}>
            <strong className={'product-name'}>
              {chosenProduct.productName}
            </strong>
            <span className={'resto-name'}>{restaurant?.memberNick}</span>
            <span className={'resto-name'}>{restaurant?.memberPhone}</span>
            <Box className={'rating-box'}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={'evaluation-box'}>
                <div className={'product-view'}>
                  <RemoveRedEyeIcon sx={{ mr: '10px' }} />
                  <span>{chosenProduct.productViews}</span>
                </div>
              </div>
            </Box>
            <p className={'product-desc'}>
              {chosenProduct?.productDesc
                ? chosenProduct?.productDesc
                : 'No description'}
            </p>
            <Divider height="1" width="100%" bg="#000000" />
            <div className={'product-price'}>
              <span>Price:</span>
              <span>{chosenProduct?.productPrice}</span>
            </div>
            <div className={'button-box'}>
              <Button
                variant="contained"
                onClick={(e) => {
                  onAdd({
                    _id: chosenProduct._id,
                    quantity: 1,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: chosenProduct.productImages[0],
                  });
                  e.stopPropagation();
                }}
              >
                Add To Basket
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
