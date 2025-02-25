import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import DetailScreen from '../src/screens/DetailScreen';
import {Provider} from 'react-redux';
import {Product} from '../src/store/types/Types';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ProductReducer from '../src/store/reducers/ProductReducer';
import {  configureStore } from '@reduxjs/toolkit';

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
const Stack = createStackNavigator();

const mockProduct: Product = {
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  price: 109.95,
  description:
    'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: {rate: 3.9, count: 120},
};

describe('DetailScreen', () => {
  it('renders loading state while fetching product', () => {
    const store = mockStore;

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Detail" component={DetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders error message if fetching fails', () => {
    const store = mockStore;

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Detail" component={DetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Error: Failed to fetch product')).toBeTruthy();
  });

  it('renders product not found message if product is not found', () => {
    const navigate = jest.fn();

    const store = mockStore;

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Detail"
              component={() => (
                <DetailScreen
                navigation={{ navigate } as any}
                  route={
                    {
                      key: 'Detail',
                      name: 'Detail',
                      params: {productId: 1},
                    } as any
                  }
                />
              )}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Product not found')).toBeTruthy();
  });

  it('renders product details correctly', async () => {
    const navigate = jest.fn();

    const store = mockStore;

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Detail"
              component={() => (
                <DetailScreen
                navigation={{ navigate } as any}
                route={
                    {
                      key: 'Detail',
                      name: 'Detail',
                      params: {productId: 1},
                    } as any
                  }/>
              )}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText(mockProduct.title)).toBeTruthy();
      expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeTruthy();
      expect(screen.getByText(mockProduct.description)).toBeTruthy();
    });
  });

  it('goes back to previous screen when back button is pressed', () => {
    const navigate = jest.fn();
    const store = mockStore;

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Detail"
              component={() => (
                <DetailScreen
                  navigation={{
                    navigate,
                    goBack: navigate.mockReturnValueOnce(undefined),
                  }}
                  route={
                    {
                      key: 'Detail',
                      name: 'Detail',
                      params: {productId: 1},
                    } as any
                  }
                />
              )}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );

    const backButton = screen.getByRole('button');
    fireEvent.press(backButton);

    expect(navigate).toHaveBeenCalledWith(undefined);
  });
});
