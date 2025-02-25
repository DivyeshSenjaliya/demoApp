import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
import { Provider } from 'react-redux';
import {  configureStore } from '@reduxjs/toolkit';
import ProductReducer from '../src/store/reducers/ProductReducer';

const mockStore = configureStore({
  reducer: { products: ProductReducer },
});

describe('App Component', () => {
  it('renders the App component with navigation and store', () => {
    const store = mockStore;

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
