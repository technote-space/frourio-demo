import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import { Card, CardContent, FormControl, FormLabel, Input, Button } from '@material-ui/core';
import useAuthToken from '~/hooks/useAuthToken';
import PasswordInput from '~/components/PasswordInput';
import { addDisplayName } from '~/utils/component';
import { client } from '~/utils/api';
import { setWarning } from '~/utils/actions';
import { useDispatchContext } from '~/store';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  login: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  input: {
    margin: '1rem',
    display: 'flex',
  },
});

const Login: FC = () => {
  const classes = useStyles();
  const { dispatch } = useDispatchContext();
  const [, setToken] = useAuthToken();

  const handleSubmit = useCallback((values, actions) => {
    client.login.post({ body: { email: values.email, pass: values.password } }).then(data => {
      if (data?.headers?.authorization) {
        setToken(data.headers.authorization);
      } else {
        actions.setSubmitting(false);
        setWarning(dispatch, 'Invalid header');
      }
    }).catch(error => {
      actions.setSubmitting(false);
      setWarning(dispatch, error.message);
    });
  }, []);

  const settings = useMemo(() => [
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
  ], []);

  return useMemo(() =>
    <div className={classes.wrap}>
      <Card>
        <CardContent>
          <Formik
            initialValues={Object.assign({}, ...settings.map(setting => ({ [setting.id]: setting.initialValue })))}
            onSubmit={handleSubmit}
          >
            {((props) => <Form onSubmit={props.handleSubmit}>
              {settings.map(setting => <Field name={setting.id} key={setting.id}>
                {({ field }) =>
                  <FormControl
                    required={setting.isRequired}
                    className={classes.input}
                  >
                    <FormLabel htmlFor={setting.id}>{setting.label}</FormLabel>
                    <setting.component {...{ ...field, id: setting.id, disabled: props.isSubmitting }}/>
                  </FormControl>}
              </Field>)}
              <div className={classes.login}>
                <Button
                  size="medium"
                  type="submit"
                  disabled={props.isSubmitting}
                >
                  Login
                </Button>
              </div>
            </Form>)}
          </Formik>
        </CardContent>
      </Card>
    </div>, [classes]);
};

export default Login;
