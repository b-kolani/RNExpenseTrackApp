import { StyleSheet, View } from "react-native";
import { useContext, useLayoutEffect } from "react";

import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);

  /**This screen component will have different modes, this simply 
  means the fact that we can either be adding a new expense if we click 
  on the plus icon in the top header corner on both screens or editing 
  an existing expense if we click on an existing expense.We open the same 
  screen in both cases but I actually want to do different things on the 
  screen. */
  /**Here we verify if it is an editing or an adding.Now it is possible that 
  we load this screen without any params.In that case, params would be undefined
  and trying to access a property like this would cause an error.We can use this
  conditional operator that's built into modern javaScript to check if params is 
  undefined, in which case we don't drill into it.So this code then is not executed
  and this overall instead returns undefined.If params happens to be defined, if it 
  is an object, we do drill into it and we do get that expenseId value or prop.So
  that is a safe way of drilling into an object which might be undefined.Therefore
  we know, that if editedExpenseId is not undefined, we are editing because we have an
  ID.And if it is undefined, we failed to retrieve an ID, which means we are adding.*/
  const editedExpenseId = route.params?.expenseId;
  const isEditing =
    !!editedExpenseId; /**!! is a common javaScript trick, to convert a 
  value into a boolean, because with that, we convert a falsy value into false and a
  truthy value into true.*/

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  function deleteExpenseHandler() {
    /** The goBack() method provided by the navigation prop, 
    which is basically the equivalent to pressing a back 
    button if there is one.Go back in the context of this 
    screen means that we go back to the screen that opened
    that screen, which means that we close this screen, we 
    close the modal. */
    /**Make the delete before go back to the previous screen
    because this runs synchronously anyways */
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler() {
    if (isEditing) {
      expensesCtx.updateExpense(editedExpenseId, {
        description: "Test!!!",
        amount: 29.99,
        date: new Date("2023-09-08"),
      });
    } else {
      expensesCtx.addExpense({
        description: "Test",
        amount: 19.99,
        date: new Date("2023-09-06"),
      });
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={cancelHandler}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </View>
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
