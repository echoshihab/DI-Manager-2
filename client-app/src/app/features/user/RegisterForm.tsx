import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";

import { FORM_ERROR } from "final-form";
import {
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
  composeValidators,
} from "revalidate";
import { RootStoreContext } from "../../stores/rootStore";
import { IUserFormValues } from "../../models/user";

import ErrorMessage from "../../common/form/ErrorMessage";
import TextInput from "../../common/form/TextInput";

const validate = combineValidators({
  userName: isRequired("Username"),
  displayName: isRequired("Display Name"),
  email: isRequired("email"),
  password: composeValidators(isRequired, hasLengthGreaterThan(5))("password"),
});

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
            content="Sign up to Request Coordinator Access"
            color="blue"
            text-align="center"
          />
          <Field name="userName" component={TextInput} placeholder="Username" />
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Display name"
          />
          <Field name="email" component={TextInput} placeholder="Email" />

          <Field
            name="password"
            component={TextInput}
            type="password"
            placeholder="Password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="green"
            content="Register"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default RegisterForm;
