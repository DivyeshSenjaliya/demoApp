import { configureStore } from '@reduxjs/toolkit';
import ProductReducer from './reducers/ProductReducer';

const Store = configureStore({
  reducer: {
    products: ProductReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
