import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";

import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";

import { RootStoreContext } from "../../stores/rootStore";
import TextInput from "../../common/form/TextInput";
import { IUserFormValues } from "../../models/user";
import ErrorMessage from "../../common/form/ErrorMessage";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Administrative Login"
            color="black"
            text-align="center"
          />
          <Field name="email" component={TextInput} placeholder="Email" />

          <Field
            name="password"
            component={TextInput}
            type="password"
            placeholder="Password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid email or password"
            />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="black"
            content="Login"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default LoginForm;
