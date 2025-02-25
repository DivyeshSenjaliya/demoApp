import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {getTopPadding} from '../utils/Function';

type LoginScreenProps = {
    navigation: any;
};

const LoginScreen:  React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [topPadding, setTopPadding] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const padding = await getTopPadding();
      setTopPadding(padding);
    })();
  });

  const logoAnimation = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, [logoAnimation]);

  const handleLogin = () => {
    setIsLoading(true);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      if (username === 'Test' && password === 'Password') {
        navigation.navigate('Home');
      } else {
        Alert.alert('Invalid credentials');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
      keyboardVerticalOffset={0}>
      <View style={[styles.container, {paddingTop: topPadding}]}>
        <Animated.Image
          source={require('../assets/logo.png')}
          style={[styles.logo, {transform: [{scale: logoAnimation}]}]}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            placeholderTextColor={'#888'}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholderTextColor={'#888'}
          />
        </View>
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loadingButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            {isLoading ? (
              <Text style={styles.loginButtonText}>Loading...</Text>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#282c34',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#3c3f45',
    color: 'white',
  },
  loginButton: {
    backgroundColor: '#61dafb',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loadingButton: {
    backgroundColor: '#88b0bf',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
