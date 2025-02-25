import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {Product} from '../store/types/Types';
import {getTopPadding} from '../utils/Function';

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {products, loading, error} = useSelector(
    (state: RootState) => state.products,
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // const scaleAnims = useRef<Animated.Value>(null);
  const scaleAnims = useRef<Animated.Value[]>([]);
  const [topPadding, setTopPadding] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const padding = await getTopPadding();
      setTopPadding(padding);
    })();
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const renderItem = ({item, index}: {item: Product; index: number}) => {
    if (!scaleAnims.current[index]) {
      scaleAnims.current[index] = new Animated.Value(1);
    }
    const scaleAnim = scaleAnims.current[index];

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {productId: item.id})}
        style={styles.productContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}>
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <Image source={{uri: item.image}} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[styles.container, {opacity: fadeAnim, paddingTop: topPadding}]}>
      <View style={styles.header}>
        <Text style={styles.productTitle}>E-commerce</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#282c34',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
  },
  productContainer: {
    flex: 1 / 2,
    margin: 5,
    backgroundColor: '#3c3f45',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 15,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
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

export default HomeScreen;
