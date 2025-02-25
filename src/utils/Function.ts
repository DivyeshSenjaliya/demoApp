import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getTopPadding = async () => {
  const windowHeight = Dimensions.get('window').height;
  const screenHeight = Dimensions.get('screen').height;
  const hasNotch = DeviceInfo.hasNotch();

  if (Platform.OS === 'android') {
    const statusBarHeight = StatusBar.currentHeight || 24;
    return statusBarHeight;
  } else if (Platform.OS === 'ios') {
    if (hasNotch) {
      return 55;
    } else if (windowHeight < screenHeight) {
      return 55;
    } else {
      return 25;
    }
  }
  return 0;
};
