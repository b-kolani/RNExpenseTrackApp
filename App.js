import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ManageExpense from "./screens/ManageExpense";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import { GlobalStyles } from "./constants/styles";
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

/**We could create the component below ins a separate file,
but I will keep it here to have all my navigation set up in 
this life*/
function ExpensesOverview() {
  /**We set the screenOptions here because it is this navigator
  header that is displayed and we hidden the Stack navigator one
  because initially we have two headers and it is up to you
  for which to keep as header. */
  return (
    <BottomTabs.Navigator
      /**So this function below, which we pass to screen options
    will be executed by React Navigation.It expects to get back 
    the configuration object i.e the screenOptions object but it 
    will give us an object as parameter and that object which we 
    receive automatically will have a navigation property which is
    that navigation object we also get when using the useNavigation 
    hook for example.And we can use this hook instead here*/
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 }, //This will style the bottom tab bar
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate("ManageExpense");
            }}
          />
        ) /**We add this button in the top right corner of the header
        of both BottomTabs navigator screens instead of the stack navigator
        since it is only from these screens we can access to the screen 
        where we can add expenses */,
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          /**Here when you return the icon component in parenthesis 
          you don't need the return statement */
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All Expenses",
          /**But here if you suse curly braces to return the icon 
          you must add the return statement if not it doesn't work */
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="calendar" size={size} color={color} />;
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

/**NavigationContainer is a component that must be wrapped
around all your other navigation related components, or all 
the other components coming from the React Navigation packages 
that deal with setting up your screen structure and your 
navigation structure overall.*/
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ExpensesContextProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: "white",
            }}
          >
            <Stack.Screen
              name="ExpensesOverview"
              component={ExpensesOverview}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManageExpense"
              component={ManageExpense}
              options={{
                presentation:
                  "modal" /**This option allows us to control how this screen
              will be loaded.And I will set this to modal to change the presentation especially 
              on iOS.On Android, it won't change too much, but on iOS this will now open this 
              screen differently.*/,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpensesContextProvider>
    </>
  );
}
