import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatchContext } from '~/store';
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react';
import PasswordInput from '~/components/PasswordInput';
import { apiClient } from '~/utils/apiClient';
import { getDisplayName } from '~/utils/component';
import styles from '~/styles/components/Login.module.scss';

const Login: FC = () => {
  const { dispatch } = useDispatchContext();
  const handleSubmit = useCallback((values, actions) => {
    console.log(values);
    apiClient.login.post({ body: { email: values.email, pass: values.password } }).then(data => {
      console.log(data);
    }).catch(() => {
      actions.setSubmitting(false);
    });
  }, []);

  const settings = [
    {
      id: 'email',
      isRequired: true,
      label: 'Email address',
      component: getDisplayName('Email', props => <Input type="email" placeholder="Enter email address" {...props}/>),
      initialValue: '',
    },
    {
      id: 'password',
      isRequired: true,
      label: 'Password',
      component: getDisplayName('Password', props => <PasswordInput {...props}/>),
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
                <setting.component {...{ ...field, id: setting.id }}/>
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
