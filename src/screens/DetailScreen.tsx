import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {Product} from '../store/types/Types';
import {getTopPadding} from '../utils/Function';

type DetailScreenProps = {
    route: RouteProp<any, any>;
    navigation: any;
};

const DetailScreen: React.FC<DetailScreenProps> = ({navigation,route}) => {
  const productId = route.params?.productId;
  const {products, loading, error} = useSelector(
    (state: RootState) => state.products,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [topPadding, setTopPadding] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const padding = await getTopPadding();
      setTopPadding(padding);
    })();
  });

  const imageScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const priceTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const foundProduct = products.find(product => product.id === productId);
    setSelectedProduct(foundProduct || null);
  }, [products, productId]);

  useEffect(() => {
    if (selectedProduct) {
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(priceTranslateY, {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [
    selectedProduct,
    imageScale,
    titleOpacity,
    priceTranslateY,
    descriptionOpacity,
  ]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#61dafb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!selectedProduct) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, {paddingTop: topPadding}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={require('../assets/arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product</Text>
        <View style={styles.icon} />
      </View>
      <ScrollView style={styles.container} bounces={false}>
        <Animated.Image
          source={{uri: selectedProduct.image}}
          style={[styles.productImage, {transform: [{scale: imageScale}]}]}
          resizeMode="cover"
        />
        <View style={styles.productDetails}>
          <Animated.Text style={[styles.productTitle, {opacity: titleOpacity}]}>
            {selectedProduct.title}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.productPrice,
              {transform: [{translateY: priceTranslateY}]},
            ]}>
            ${selectedProduct.price.toFixed(2)}
          </Animated.Text>
          <Animated.Text
            style={[styles.productDescription, {opacity: descriptionOpacity}]}>
            {selectedProduct.description}
          </Animated.Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#282c34'},
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18, // Larger title
    marginBottom: 8,
    color: 'white', // White text
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#282c34', // Dark background
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  productImage: {
    width: '100%',
    height: Dimensions.get('window').width * 0.8, // Responsive image height
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 12, // Rounded corners
  },
  productDetails: {
    padding: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // White text
  },
  productPrice: {
    fontSize: 20,
    color: '#61dafb', // React blue
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ccc', // Light gray text
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DetailScreen;
