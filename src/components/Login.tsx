import type { FC } from 'react';
import { useEffect, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { Formik, Form, Field } from 'formik';
import { addDays } from 'date-fns';
import { FormControl, FormLabel, Input, Button } from '@material-ui/core';
import PasswordInput from '~/components/PasswordInput';
import { addDisplayName } from '~/utils/component';
import { client } from '~/utils/api';
import { setWarning } from '~/utils/actions';
import { useDispatchContext } from '~/store';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrap: {
    padding: '10px',
    border: 'solid #7f7f7f',
  },
  login: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  input: {
    margin: '1rem',
  },
});

const Login: FC = () => {
  const classes                    = useStyles();
  const { dispatch }               = useDispatchContext();
  const [{ authToken }, setCookie] = useCookies(['authToken']);
  const setAuthToken               = token => {
    setCookie('authToken', token, {
      expires: addDays(new Date(), 30),
    });
  };

  useEffect(() => {
    if (authToken) {
      setAuthToken(authToken);
    }
  }, []);

  const handleSubmit = useCallback((values, actions) => {
    client.login.post({ body: { email: values.email, pass: values.password } }).then(data => {
      if (data?.headers?.authorization) {
        setAuthToken(data.headers.authorization);
      } else {
        actions.setSubmitting(false);
      }
    }).catch(error => {
      actions.setSubmitting(false);
      setWarning(dispatch, error.message);
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
    <div className={classes.wrap}>
      <Formik
        initialValues={Object.assign({}, ...settings.map(setting => ({ [setting.id]: setting.initialValue })))}
        onSubmit={handleSubmit}
      >
        {((props) => <Form onSubmit={props.handleSubmit}>
          {settings.map(setting => <Field name={setting.id} key={setting.id}>
            {({ field, form }) =>
              <FormControl
                error={form.errors[setting.id] && form.touched[setting.id]}
                required={setting.isRequired}
                className={classes.input}
              >
                <FormLabel htmlFor={setting.id}>{setting.label}</FormLabel>
                <setting.component {...{ ...field, id: setting.id, disabled: props.isSubmitting }}/>
                <div className={classes.error}>{form.errors[setting.id]}</div>
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
    </div>, []);
};

export default Login;
