import { Member } from './member';
import { Product } from './products';

/* REACT APP STATE */
export interface AppStoreState {
  homePage: HomaPageState;
}

/* HOMEPAGE PAGE */
export interface HomaPageState {
  topUsers: Product[];
  newDishes: Product[];
  popularDishes: Member[];
}

/* PRODUCTS PAGE */

/* ORDERS PAGE */
