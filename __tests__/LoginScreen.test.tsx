import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('../src/utils/Function.ts', () => ({
  getTopPadding: jest.fn().mockResolvedValue(20),
}));

const Stack = createStackNavigator();

describe('LoginScreen', () => {
  it('renders login screen components correctly', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(screen.getByText('Welcome!')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('updates username and password inputs on change', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpassword');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('testpassword');
  });


  it('navigates to Home screen on successful login', () => {
    const navigate = jest.fn();
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={() => <LoginScreen navigation={{ navigate } as any} />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );


    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.changeText(usernameInput, 'Test');
    fireEvent.changeText(passwordInput, 'Password');
    fireEvent.press(loginButton);

    expect(navigate).toHaveBeenCalledWith('Home');
  });

  it('shows alert on unsuccessful login', () => {
    Alert.alert = jest.fn();

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('shows loading indicator while logging in', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('disables login button while logging in', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);

    expect(loginButton).toBeDisabled();
  });
});
