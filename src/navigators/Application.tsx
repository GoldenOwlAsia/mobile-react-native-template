import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import type { ApplicationStackParamList } from '@/types/navigation';
import { Home, SignIn } from '@/screens';
import { isLoggedInSelector } from '@/stores/user/selector';

const Stack = createStackNavigator<ApplicationStackParamList>();

const ApplicationNavigator = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
