import { createContext, useReducer } from "react";

/**const DUMMY_EXPENSES = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2021-12-19"),
  },
  {
    id: "e2",
    description: "A pair of trousers",
    amount: 89.29,
    date: new Date("2022-01-05"),
  },
  {
    id: "e3",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2021-12-01"),
  },
  {
    id: "e4",
    description: "A book",
    amount: 14.99,
    date: new Date("2023-09-10"),
  },
  {
    id: "e5",
    description: "Another book",
    amount: 18.59,
    date: new Date("2023-09-08"),
  },
  {
    id: "e6",
    description: "A pair of trousers",
    amount: 89.29,
    date: new Date("2022-01-05"),
  },
  {
    id: "e7",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2021-12-01"),
  },
  {
    id: "e8",
    description: "A book",
    amount: 14.99,
    date: new Date("2023-09-10"),
  },
  {
    id: "e9",
    description: "Another book",
    amount: 18.59,
    date: new Date("2023-09-08"),
  },
];*/

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

/**Below we defined a function which is the so-called
reducer function for the useReducer hook.And the both 
function's parameters will automatically be provided by 
React because this function will be connect to the 
useReducer hook.With the action parameter we can then 
check the type of action that we received.And it will be
us who dispatch an action later.So we will be able to set
different action types.So now I'm dispatching 
different actions, and these different actions will lead 
to different state changes inside of expensesReducer.Because 
the job of the reducer function is to always return a new state value.*/
function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      /**The payload object data is spread into a new object here.
    And I'm using a new object and a new array here to update the state
    in an immutable way.So to make sure that we don't mutate
    original data in memory, but we create a brand new state snapshot, which
    then will be used by React to update the old state snapshot.Here wet rid of 
    this custom ID because now we sav data in a backend IDs will be generated 
    automatically by Firebase.So we must remove it otherwise will get 
    a problem when updating, deleting etc. */
      //const id = new Date().toString() + Math.random().toString();
      return [action.payload, ...state];
    case "SET":
      /**By default fetched expenses displayed in the order of Firebase 
    they are listed and ordered by time not by date.Now I wanna keep my order*/
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  /**The useReducer() hook is provided by React.It's another hook
    built into React, nothing Expo or React Native specific, which is 
    all the used for state management but which can be very useful if 
    you have more complex state management with different scenarios, 
    which we kind of do here.Then thereafter, useReducer like useState
    returns an array with exactly two elements.The first element is our
    expensesState, so the state that will be managed by the reducer 
    now made available in this component function.And the second element
    here will be a dispatch function which we can execute to dispatch a 
    new action to the reducer function, which is then able to manipulate
    the state, which we then get as a new state in this component function,
    which will be reevaluated if the state changes automatically, all thanks 
    to React and this hook.How can we assume that state will be an array? Well, 
    it's our reducer so it's up to you what we return, but for the first time
    this component renders when we have no expenses yet, for example, when the 
    app just started up, we can also pass a second value to useReducer where we
    set our initial values.And that second parameter value will be used as an 
    initial state value before the reducer function executed the first time.
    And then when it executes the next time, because an action was dispatched, 
    we get the existing state, which is that array full of dummy expenses in 
    this case.As we have get rid of DUMMY_EXPENSES we used for test purpose, now 
    we put as initial or default values an empty array. */
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function addExpense(expenseData) {
    /**So you can pass a value to dispatch which will be made available by 
    React inside of the reducer function as the second parameter in this case 
    the action parameter.So this action is the value you dispatch here.Now you 
    can dispatch anything, a number, a string.Here I will dispatch an object 
    with a type property of add, but that's just my choice.I could have also
    named this kind or mode or whatever, but here I'll name it type also because 
    I'm already checking for type here.This then allows me to identify the kind,
    the type of action that I wanna handle now in the reducer function.So the type 
    is add here and I can then set a payload.This property name is also up to you
    though, could also be named data, whatever you want, but payload is kind of 
    common. */
    dispatch({ type: "ADD", payload: expenseData });
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  /**Now we also need to construct a value object here, 
  which bundles all our data and these functions together,
  to expose them to all the interested components, through 
  that provider component down there.*/
  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
