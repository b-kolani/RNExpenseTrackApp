import { StyleSheet, View } from "react-native";
import { useContext, useLayoutEffect, useState } from "react";

import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  /**Initially, this state below is false because initially, we're not sending
  data.Initially, we're gathering data from the user through the user inputs.  */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
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

  /**Fetching the expense by editedExpense because when editing we must get the expense 
  different properties prefilled in inputs fields  */
  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      /**Here it is up to you, the order in which we want to delete 
    either locally before in backend or in backend before in context 
    locally.*/
      await deleteExpense(editedExpenseId);
      /** The goBack() method provided by the navigation prop, 
    which is basically the equivalent to pressing a back 
    button if there is one.Go back in the context of this 
    screen means that we go back to the screen that opened
    that screen, which means that we close this screen, we 
    close the modal. */
      /**Make the delete before go back to the previous screen
    because this runs synchronously anyways */
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack(); /**Note:setIsSubmitting(false);we don't need to switch back to false
      then because we are closing this screen anyways by going back, 
      so there's no need to update this state. */
    } catch (error) {
      setError("Could not delete expense - please try again later");
      setIsSubmitting(false); /**setIsSubmitting(false);here we need to 
      switch here back to false
      then because in that case, we stay on this page, and if we then
      clicked the okay button on the ErrorOverlay component,I don't wanna 
      show the  LoadingOverlay instead.*/
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  /**We transform this function into an async one, so that we can await 
  the storeExpense because it will return a promise.And then, eventually 
  we will get that ID to which that promise resolves. */
  async function confirmHandler(expenseData) {
    /**When this function confirmHandler starts to execute that we
    then want to set isSubmitting to true because we will be sending 
    either the update or the adding request.*/
    setIsSubmitting(true);
    try {
      /**For test purpose we can pass some dummy objects 
    data to different functions.For example {
        description: "Test",
        amount: 19.99,
        date: new Date("2023-09-06"),
      } before using real entered values of the expenseData 
      parameter which is an object.*/
      if (isEditing) {
        /**We're doing here some optimistic updating here because we updated
      locally first, and then we send the updated data to the backend. */
        expensesCtx.updateExpense(editedExpenseId, expenseData);
        /**We could also add await keyword below, but it doesn't matter too much
      in this place because at the moment we're not doing anything, once we're 
      done sending the request.Still for completeness sake, I will await so that
      we actually only close the modal or screen and we only go back after the
      update request succeeded.I guess that (goBack) is the one thing we are 
      doing after sending the request, so waiting for the response does make 
      sense here.*/
        await updateExpense(editedExpenseId, expenseData);
      } else {
        /**This function will send a http request.Here, for adding we can't
      choose that reversed order i.e we can't add locally before send new 
      data to the backend because here we rely on the response of our request
      to get the auto created ID.*/
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }

  /**When this function is triggered by clicking the okay button
  on the ErrorOverlay, the inputs are cleared because the ManageExpense
  component was reevaluated, and therefore it wiped all the entered data.
  Now you could save that entered data in some state that is then used once
  this errorHandler function executes here to keep things simpler.And since
  the okay button on the ErrorOverlay component doesn't make a lot of sense
  in this app anyways, I will get rid of that errorHandler so in this component
  we don't need to pass onConfirm as prop with the errorHandler function as value.
  */
  /**  function errorHandler() {
    setError(null);
  }*/

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedExpense} // The name is up to you
      />
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
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
