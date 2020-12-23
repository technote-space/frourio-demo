import type { FC } from 'react';
import { useEffect, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { Formik, Form, Field } from 'formik';
import { addDays } from 'date-fns';
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react';
import { useDispatchContext } from '~/store';
import PasswordInput from '~/components/PasswordInput';
import { apiClient } from '~/utils/apiClient';
import { addDisplayName } from '~/utils/component';
import styles from '~/styles/components/Login.module.scss';

const Login: FC = () => {
  const { dispatch }               = useDispatchContext();
  const [{ authToken }, setCookie] = useCookies(['authToken']);

  const setAuthToken = token => {
    setCookie('authToken', token, {
      expires: addDays(new Date(), 30),
    });
    dispatch({ type: 'AUTH_TOKEN', authToken: token });
  };
  useEffect(() => {
    if (authToken) {
      setAuthToken(authToken);
    }
  }, []);

  const handleSubmit = useCallback((values, actions) => {
    apiClient.login.post({ body: { email: values.email, pass: values.password } }).then(data => {
      if (data?.headers?.authorization) {
        setAuthToken(data?.headers?.authorization);
      } else {
        actions.setSubmitting(false);
      }
    }).catch(() => {
      actions.setSubmitting(false);
    });
  }, []);

  const settings = [
    {
      id: 'email',
      isRequired: true,
      label: 'Email address',
      component: addDisplayName('Email', props => <Input type="email" placeholder="Enter email address" {...props}/>),
      initialValue: '',
    },
    {
      id: 'password',
      isRequired: true,
      label: 'Password',
      component: addDisplayName('Password', props => <PasswordInput {...props}/>),
      initialValue: '',
    },
  ];

  return useMemo(() =>
    <div className={styles.wrap}>
      <Formik
        initialValues={Object.assign({}, ...settings.map(setting => ({ [setting.id]: setting.initialValue })))}
        onSubmit={handleSubmit}
      >
        {((props) => <Form onSubmit={props.handleSubmit}>
          {settings.map(setting => <Field name={setting.id} key={setting.id}>
            {({ field, form }) =>
              <FormControl
                isInvalid={form.errors[setting.id] && form.touched[setting.id]}
                isRequired={setting.isRequired} p={4}
              >
                <FormLabel htmlFor={setting.id}>{setting.label}</FormLabel>
                <setting.component {...{ ...field, id: setting.id, disabled: props.isSubmitting }}/>
                <FormErrorMessage>{form.errors[setting.id]}</FormErrorMessage>
              </FormControl>}
          </Field>)}
          <div className={styles.login}>
            <Button
              colorScheme="teal"
              size="md"
              mt={4}
              type="submit"
              isLoading={props.isSubmitting}
            >
              Login
            </Button>
          </div>
        </Form>)}
      </Formik>
    </div>, []);
};

export default Login;
