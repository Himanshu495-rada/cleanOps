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
// client 2
import C2Admin from './screens/client2/c2admin/admin';
import C2Admin2 from './screens/client2/c2admin2/admin2';
import C2IssueScreen from './screens/client2/c2issueScreen/issueScreen';
import C2ResolvedScreen from './screens/client2/c2resolvedScreen/resolvedScreen';
import C2ReportIssue from './screens/client2/c2reportIssue/reportIssue';
import C2ResolvedScreen2 from './screens/client2/c2admin2/resolvedScreen2';

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
          name="Login"
          component={Login}
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
        {/* client 2 */}
        <Stack.Screen
          name="C2Admin"
          component={C2Admin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="C2Admin2"
          component={C2Admin2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="C2IssueScreen"
          component={C2IssueScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="C2ResolvedScreen"
          component={C2ResolvedScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="C2ReportIssue"
          component={C2ReportIssue}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="C2ResolvedScreen2"
          component={C2ResolvedScreen2}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
