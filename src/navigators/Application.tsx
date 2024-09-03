import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import type { ApplicationStackParamList } from '@/types/navigation';
import { Home, SignIn } from '@/screens';

const Stack = createStackNavigator<ApplicationStackParamList>();

const ApplicationNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SignIn">
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
