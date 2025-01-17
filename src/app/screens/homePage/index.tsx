import React, { useEffect } from 'react';
import ActiveUsers from './ActiveUsers';
import Advertisement from './Advertisement';
import Events from './Events';
import NewDishes from './NewDishes';
import PopularDishes from './PopularDishes';
import Statistics from './Statistics';
import '../../../css/home.css';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setNewDishes, setPopularDishes, setTopUsers } from './slice';
import { Product } from '../../../lib/types/products';
import ProductService from '../../services/ProductService';
import { ProductCollection } from '../../../lib/enums/product.enum';
import MemberService from '../../services/MemberService';
import { Member } from '../../../lib/types/member';
import { CartItem } from '../../../lib/types/search';

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage(props: HomePageProps) {
  const { onAdd } = props;
  // 3. useDispatch() actionDispatchdagi dispatch argumentmi?
  const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(
    useDispatch()
  );

  useEffect(() => {
    // Backend server data request => Data
    const products = new ProductService();
    const members = new MemberService();
    products
      .getProducts({
        order: 'productViews',
        page: 1,
        limit: 30,
        productCollection: ProductCollection.PIZZA,
      })
      .then((data) => setPopularDishes(data))
      .catch((err) => console.log(err));

    products
      .getProducts({
        order: 'createdAt',
        page: 1,
        limit: 30,
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log(err));

    members
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="homepage">
      <Statistics />
      <PopularDishes onAdd={onAdd} />
      <NewDishes />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}
