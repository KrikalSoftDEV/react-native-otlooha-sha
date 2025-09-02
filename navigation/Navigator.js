import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/splash/SplashScreen";

const Stack = createNativeStackNavigator();

export function Navigator() {
    
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name={"Splash_1"} component={SplashScreen} />
            <Stack.Screen options={{headerShown: false}} name={"Splash_1"} component={SplashScreen} />
        </Stack.Navigator>
    );
}