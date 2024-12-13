'use client'

// System Utils
import { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Installed Utils
import {useTranslations} from 'next-intl';
import { Button, Center, Input, Text, Container, VStack } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { ErrorOutline, NotificationsOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { UserNewPassword } from '@/lib/models/User';
import { changePassword, resetState } from '@/lib/redux/features/auth/authSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';

const AuthChangePassword: React.FC<{code: string}> = ({code}) => {
    // Get the router instance
    const router = useRouter();

    // Get the words by group
    const t = useTranslations('auth');

    // Create the validation schema
    const validationSchema = Yup.object().shape({
        password: Yup.string().min(8, t('the_password_is_short')).max(50, t('the_password_is_long')).required(t('the_password_is_required')),
        repeatPassword: Yup.string().min(8, t('the_password_is_short')).max(50, t('the_password_is_long')).required(t('the_password_is_required')).oneOf([Yup.ref('password')], t('passwords_must_match'))
    });

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the success and error messages
    const { successMessage, errorMessage, isLoading } = useSelector((state: RootState) => state.auth.changePassword);

    // Monitor success message change
    useEffect(() => {
      if ( successMessage ) {
        setTimeout(() => {
          dispatch(resetState());
          router.push('/');
        }, 2000);
      }
    }, [successMessage, router, dispatch]);

    return (
        <Formik<UserNewPassword>
        initialValues={{ password: '', repeatPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          dispatch(changePassword({
            code: code,
            password: values.password,
            repeatPassword: values.repeatPassword
          }));
        }}
      >
        {(formikProps: FormikProps<UserNewPassword>) => (
        <Form noValidate onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            formikProps.handleSubmit(e);
          }}
          className='authForm'
          >
            <VStack mt={4}>
                <Field name="password">
                {({ field, form }: { field: any; form: any }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password} width="100%">
                    <FormLabel htmlFor="password">{ t('new_password') }</FormLabel>
                    <Input {...field} type="password" id="password" placeholder={ t('enter_your_password') } autoComplete="new-password" />
                      <FormErrorMessage>
                        <ErrorOutline />
                        <span>
                          {form.errors.password}
                        </span>
                      </FormErrorMessage>
                    </FormControl>
                )}
                </Field>
                <Field name="repeatPassword">
                {({ field, form }: { field: any; form: any }) => (
                    <FormControl isInvalid={form.errors.repeatPassword && form.touched.repeatPassword} width="100%">
                    <FormLabel htmlFor="repeat-password">{ t('repeat_password') }</FormLabel>
                    <Input {...field} type="password" id="repeat-password" placeholder={ t('enter_your_password') } autoComplete="repeat-password" />
                      <FormErrorMessage>
                        <ErrorOutline />
                        <span>
                          {form.errors.repeatPassword}
                        </span>
                      </FormErrorMessage>
                    </FormControl>
                )}
                </Field>
                <Button
                  type="submit"
                  className={`authSubmitBtn ${isLoading && 'authSubmitActiveBtn'}`}
                  mt={4}
                  mb={5}
                  width="100%"
                  bg="green.300"
                  color="white"
                >
                  { t('save') }
                </Button>
                <Container p={0} className='auth-main-form-alerts'>
                  {(successMessage !== '')?(
                    <Text className='auth-main-form-alert-success top-to-bottom-animation'>
                      <NotificationsOutlined className='auth-main-form-alert-success-icon' />
                      { successMessage }
                    </Text>                    
                  ):''}
                  {(errorMessage !== '')?(
                    <Text className='auth-main-form-alert-error top-to-bottom-animation'>
                      <NotificationsOutlined className='auth-main-form-alert-error-icon' />
                      { errorMessage }
                    </Text>
                  ):''}
                </Container>
                <Text width="100%" textAlign="center">
                  { t('do_you_remember_the_password') + ' ' }
                  <Link
                    href='/auth/signin'
                  >
                    { t('sign_in') }
                  </Link> 
                </Text>
            </VStack>
        </Form>
    )}
    </Formik>
        );

};

export default AuthChangePassword;