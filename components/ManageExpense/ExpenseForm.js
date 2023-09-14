import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  /**Whenever you fetch an input value, you will
    get it as a string, even if the input provides 
    a number, it is still some text technically.You 
    can of course convert it to a number later to work 
    with it as a number, but initially it's a string.
    That's why I set an empty string here as a default 
    value for the amountValue.In this way we're keeping
    track of the entered value and we then use that 
    somewhere else in our application.For example, 
    when the form is submitted.*/
  //const [amountValue, setAmountValue] = useState("");

  /**We don't just have one input, but multiple inputs.
  Therefore, we might need multiple state slices, but we 
  also need multiple handler functions as the one below, 
  one for each input.That's all the not necessarily a 
  problem, but we can maybe find a solution that is a bit
  more elegant and scalable at least to a certain extent
  like done below.The solution is the following I will 
  move away from using multiple state slices, one for every
  input to using ons state slice that actually stores an object.
  So below we have one state object that manages all the 
  inputValues.We change state value to objects because we want 
  to reflect a visual feedback directly in the UI whenever the user
  get validation failed errors, so we add a property to handle the 
  validation for each input value.Here we change our state name to 
  inputs instead of inputValues because now it is not only value data
  we have we also have extra information that is validity(isValid property).*/
  const [inputs, setInputs] = useState({
    /**Here we convert values to string because as we know 
    by default input values are strings */
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      /**It means if we have
      default values they are valid and the isValid takes true as value 
      otherwise false is set as value because we will have an empty string 
      as input value by default which is not valid. 
      isValid: defaultValues ? true : false*/
      /**isValid:!!defaultValuesThis do the same as above it convert defaultsValues
      to boolean so if we have no default values, this will yield false else this will
      yield true. */
      isValid: true /**With the code above we switched this from true or false, depending
      on the fact whether we have default values or not, so change by setting it to true.
      This is technically not correct because initially an empty string of course is not 
      valid, but it helps us ensure that we initially don't show the custom error message
      and it doesn't have any negative effect to set this to true because we still validate 
      in our submission function.And we still override isValid to the actual validity after 
      running our validity checks.*/,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      /**Below both codes work */
      // isValid: defaultValues ? true : false,
      //isValid: !!defaultValues,
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      //isValid: defaultValues ? true : false,
      //isValid: !!defaultValues,
      isValid: true,
    },
  });

  /**Note that the enteredValue parameter is passed in automatically
  by React Native, but the inputIdentifier parameter isn't because that's 
  my own idea that I wanna get this identifier.*/
  function inputChangeHandler(inputIdentifier, enteredValue) {
    /**The idea is that in here, I can call setInputs
    and update the inputValues state such that we keep all the 
    input values that haven't changed, but we overwrite the one 
    value for the one input that has been changed.
    This syntax [inputIdentifier]: enteredValue is standard javaScript.
    It allows us to set and target a property dynamically.Now, the 
    property name we're setting is not inputIdentifier, but the value 
    stored in inputIdentifier.So if we receive an argument of amount,
    so a value for this argument of amount, we would target the amount
    property in the inputValues object with this code 
    [inputIdentifier]: enteredValue.So this allows us to 
    dynamically target and set property names.*/
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true } /**When we 
        update one specific identifier we actually want to update the value
        of that identifier and set it to the entered value.I will also always 
        set the validity to true then because when I'm entering something, I actually 
        do assume that it's valid and we will change it back to false later if we detect 
        that it was invalid after submission.  */,
      };
    });
  }

  /**We can now of course set the amount value, to the text
  that was entered which we conveniently get automatically
  by React Native when we connect the function below to 
  onChangeText prop.Then RN will make sure that the parameter 
  value is provided automatically, and this will be the amount
  or the value in general, entered into the text input to which
  this function is connected.And we can also set up two-way 
  binding so that we could change this amount value from somewhere
  else in our component as well and reflect the changed value in 
  the input by adding a value prop.Now, whenever we change the state,
  for example, by pressing some reset button, we also reflect that 
  changed input state in the input component where we passed the value
  prop.This line is comment because we have to handle more than one input.
  function amountChangeHandler(enteredAmount) {
    setAmountValue(enteredAmount);
  }*/

  /**So, when we talk about form submission, this primarily means that we 
  wanna collect all the entered values and maybe we also want to validate 
  them and show some feedback to the user. */
  function submitHandler() {
    /**First we collect all input values.*/
    const expenseData = {
      /**The unary operator plus here converts this string inputValues.amount
      to a number */
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    /**Below we perform validations for input fields values */
    /**So for the amount if the entered value is a string or decimal 
    number you will get an invalid input error.If the value or argument 
    passed to isNaN() method is numeric type i.e a number or a string that 
    can be converted to a number, false is returned otherwise true is returned.*/
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;

    /**We make this because if the new Date() method takes an invalid value
    an Invalid Date value is returned so we check if the date match this value 
    if not the cas the date is not valid.*/
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";

    /**trim() method removes excess wide space at the start or end of the string 
    has a length, that's greater than zero.The length method checks if the description 
    is not empty */
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      // Show some a feedback to the user to inform the user that the validation failed.
      //Alert.alert("Invalid input", "Please check your input values");
      //Instead to alert the user I wanna update the validity here
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.from}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
            value: inputs.amount.value, // or inputValues['amount'],
          }}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangeHandler.bind(this, "date"),
            value: inputs.date.value, // or inputValues['date'],
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          //autoCapitalize:'none'.This can be annoying when dealing with email addresses
          /**autoCorrect: false, default is true.
          This can be also annoying when where we have 
          to enter a email address, where it keeps 
          correcting our email address whilst we're 
          entering it.It's super annoying and can 
          lead to a lot of errors.*/
          onChangeText: inputChangeHandler.bind(this, "description"),
          value: inputs.description.value, // or inputValues['description'],
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  from: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1 /**We pass this style as prop to the input
    component because passed it directly there will cause 
    issues in the inputs disposition */,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
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
});
