import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './screens/splash/splashScreen';
import Login from './screens/login/login';
import Admin from './screens/admin/admin';
import Admin2 from './screens/admin2/admin2';
import IssueScreen from './screens/issueScreen/issueScreen';
import ResolvedScreen from './screens/resolvedScreen/resolvedScreen';
import ReportIssue from './screens/reportIssue/reportIssue';
import ResolvedScreen2 from './screens/admin2/resolvedScreen2';
import RaiseRequest from './screens/raiseRequest/raiseRequest';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Admin2"
          component={Admin2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="IssueScreen"
          component={IssueScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ResolvedScreen"
          component={ResolvedScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReportIssue"
          component={ReportIssue}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ResolvedScreen2"
          component={ResolvedScreen2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RaiseRequest"
          component={RaiseRequest}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
