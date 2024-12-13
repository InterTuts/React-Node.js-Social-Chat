'use client'

// System Utils
import { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Installed Utils
import {useTranslations} from 'next-intl';
import { Button, Center, Input, Text, VStack, Container } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { ErrorOutline, NotificationsOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { UserEmail } from '@/lib/models/User';
import { reset, resetState } from '@/lib/redux/features/auth/authSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';

const AuthResetPassword = () => {
    // Get the router instance
    const router = useRouter();

    // Get the words by group
    const t = useTranslations('auth');

    // Create the validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('the_email_is_not_valid')).required(t('the_email_is_required'))
    });

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the success and error messages
    const { successMessage, errorMessage, isLoading } = useSelector((state: RootState) => state.auth.reset);

    // Monitor success message change
    useEffect(() => {
      if ( successMessage ) {
        setTimeout(() => {
          dispatch(resetState());
        }, 2000);
      }
    }, [successMessage, router, dispatch]);

    return (
        <Formik<UserEmail>
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          dispatch(reset(values));
        }}
      >
        {(formikProps: FormikProps<UserEmail>) => (
        <Form noValidate onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            formikProps.handleSubmit(e);
          }}
          className='authForm'
          >
            <VStack mt={4}>
                <Field name="email">
                {({ field, form }: { field: any; form: any }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email} width="100%">
                    <FormLabel htmlFor="email">{ t('email') }</FormLabel>
                    <Input {...field} type="email" id="email" placeholder={ t('enter_your_email') } autoComplete="new-email" />
                      <FormErrorMessage>
                        <ErrorOutline />
                        {form.errors.email}
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
                  { t('reset') }
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
                    className='ml-2'
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

export default AuthResetPassword;