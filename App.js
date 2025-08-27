import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <--- ganti ini

import HomeScreen from './home';
import Complete from './completeanime';
import VideoPlayer from './VideoPlayer.js';
import DetailAnimeScreen from './animeinfoan';


const Stack = createNativeStackNavigator(); // <--- ganti ini

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="home" component={HomeScreen} />
     
        <Stack.Screen name="DetailAnime" component={DetailAnimeScreen} />
        <Stack.Screen name="CompleteAnime" component={Complete} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
