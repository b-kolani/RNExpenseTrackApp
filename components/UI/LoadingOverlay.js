import { View, ActivityIndicator, StyleSheet } from "react-native";

import { GlobalStyles } from "../../constants/styles";

/**ActivityIndicator a loading spinner already build into
React native, which gives us a platform-adapting loading
spinner.  */

/**In the RecentExpenses screen at the moment we 
start fetching expenses but you will see that if we 
load or reload the app initially you see the text 
that displays when there are no expenses will be 
displayed briefly before the data was loaded.And that's 
not the best user experience.I would rather show some
loading spinner or some loading overlay whilst we are
fetching and then show the results once we are done 
fetching.*/
function LoadingOverlay() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
});
