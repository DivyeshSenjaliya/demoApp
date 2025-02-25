import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { Provider } from 'react-redux';
import { Product } from '../src/store/types/Types';
import {  configureStore } from '@reduxjs/toolkit';
import ProductReducer from '../src/store/reducers/ProductReducer';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('../src/utils/Function.ts', () => ({
  getTopPadding: jest.fn().mockResolvedValue(20),
}));

const mockStore = configureStore({
    reducer: { products: ProductReducer },
});

const mockProducts: Product = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
];

describe('HomeScreen', () => {

  it('renders loading state while fetching products', () => {
    const navigate = jest.fn();

    const store = mockStore;

    render(
      <Provider store={store}>
        <HomeScreen navigation={{ navigate } as any}/>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders error message if fetching fails', () => {
    const navigate = jest.fn();

    const store = mockStore;

    render(
      <Provider store={store}>
        <HomeScreen navigation={{ navigate } as any}/>
      </Provider>
    );

    expect(screen.getByText('Error: Failed to fetch products')).toBeTruthy();
  });

  it('renders product list correctly', async () => {
    const navigate = jest.fn();

    const store = mockStore;

    render(
      <Provider store={store}>
        <HomeScreen navigation={{ navigate } as any} />
      </Provider>
    );

    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.title)).toBeTruthy();
      });
    });
  });

  it('navigates to Detail screen on product press', () => {
    const navigate = jest.fn();
    const store = mockStore;

    render(
      <Provider store={store}>
        <HomeScreen navigation={{ navigate } as any} />
      </Provider>
    );

    const productItem = screen.getByText(mockProducts.title);
    fireEvent.press(productItem);

    expect(navigate).toHaveBeenCalledWith('Detail', { productId: mockProducts.id });
  });
});
