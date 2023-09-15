import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  /**This local state will tell us whether we are currently
  loading data in this component or not.And initially that 
  can be true because we know that when this component is loaded
  for the first time, we will be fetching.*/
  const [isFetching, setIsFetching] = useState(true);

  /**Initially this state below is undefined why there is nothing
  in useState parentheses or no argument for useSate, because initially 
  we have no error, but we can set this to some message for example,
  some error message if things go wrong. */
  const [error, setError] = useState();

  /**Here expensesCtx holds data locally context */
  const expensesCtx = useContext(ExpensesContext);
  //const [fetchedExpenses, setFetchedExpenses] = useState([]);

  //So here, fetchExpenses function now yields a promise.
  //And that means that we can now wait for this promise to
  //resolve to get hold of the actual data that was returned,
  //which we of course want here
  /**Note that when adding for example a new expense it's not showing 
  up in front end.It is stored on the backend but it's not available 
  on the front end. I need to reload my app to refetch it.And then it 
  appears in front end, but that is of course not optimal.Now, why is this 
  happening?This is happening because this component (recentExpenses) actually
  wasn't removed.When I manage a new expense this component is still in the 
  background, it's not destroyed, because we use the stack navigator, and
  there, if we push a new screen onto that stack as we do with the manage 
  expense screen once we opened it so the old screen this component screen,
  still runs in the background no matter if we are an iOS or Android.That means
  that when we close the managed expense screen we don't recreate this component,
  instead it was always there.Hence the useEffect below doesn't execute again
  and therefore we don't fetch again.To fix that we keep on using context because 
  that has the advantage that we can update the context once we fetched our expenses.
  And it means that we don't have to change all the code in all our app because we can 
  keep on working with context.As an additional benefit, we have to send less HTTP request 
  because we, for example, don't have to fetch new data from the backend just because 
  we added a new expense.Because when we add a new expense we already have all the data 
  we entered on the device in input fields on the manageExpense screen, so fetching it again 
  from the backend is a bit redundant.If we keep on using context we utilize the data we already 
  have on the device  and we just update everything offline in addition to sending the data to the 
  backend.So now if we add a new expense, this also shows up immediately on the front end because 
  we store it in our local context i.e expensesCtx and we send it to the backend.Which means it's 
  available locally immediately, which of course, also makes a lot of sense and makes the app
  better because we don't have to wait for fetching that data again from the backend, instead 
  we use the data we already have.*/
  useEffect(() => {
    /**So this is a workaround so that we can still use async-await
    without turning the useEffect function itself into an async function
    because the effect function itself should not return a promise.
    And if we would turn it into a async function, it would return a promise 
    because adding async in front of a function enforce, ensures, makes that 
    function return a promise.*/
    async function getExpenses() {
      /**So we set isFetching to true as soon as we start */
      setIsFetching(true);
      /**Now, the place where things can go wrong is here.Here, we can use try-catch now.
      Try-catch will try to executing this code i.e fetchExpenses.And if it fails, we will 
      end up in a catch block.I wanna set the setIsFetching below to false outside of this 
      catch block by the way, because even if things fail, I still wanna leave my loading 
      state thereafter. */
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      }

      /**Once we've done with fetching or getting our expenses,
      we can set isFetching to false because we're not fetching
      anymore.*/
      setIsFetching(false);
      //setFetchedExpenses(expenses);
    }

    //And then we call the above function inside of the effect
    //function like this.
    getExpenses();
  }, []);

  /**Here I set error  to null to clear the error
  when the user will press on Okay button of the ErrorOverlay 
  component.So the ErrorOverlay will be removed.*/
  /**function errorHandler() {
    setError(null);/**Here after clearing the error we could 
    fetch again expenses this is up to you. */
  //}

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7DaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;
