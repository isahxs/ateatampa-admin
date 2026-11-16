import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    StoryScript: require('./assets/fonts/StoryScript-Regular.ttf'),
    NotoSans: require('./assets/fonts/NotoSans-Variable.ttf')
  });

  if (!fontsLoaded){
    return null;
  }

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
