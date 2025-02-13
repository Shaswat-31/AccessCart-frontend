import { Box, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ecommerceOutlookAnimation } from '../../../assets'; // animation data
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { selectLoggedInUser, loginAsync, selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus } from '../AuthSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  // Redirect user upon login
  useEffect(() => {
    if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/");
    } else if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    }
  }, [loggedInUser]);

  // Display login error using toast
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Handle login status and reset on unmount
  useEffect(() => {
    if (status === 'fullfilled' && loggedInUser?.isVerified === true) {
      toast.success('Login successful');
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      dispatch(resetLoginStatus());
    };
  }, [status]);

  // Handle login form submission
  const handleLogin = (data) => {
    const credentials = { ...data };
    delete credentials.confirmPassword;
    dispatch(loginAsync(credentials));
  };

  return (
    <Stack width="100vw" height="100vh" flexDirection="row" sx={{ overflowY: "hidden" }}>
      {
        !is900 && (
          <Stack bgcolor="black" flex={1} justifyContent="center">
            <Lottie animationData={ecommerceOutlookAnimation} style={{ maxWidth: '80%', margin: 'auto' }} />
          </Stack>
        )
      }

      <Stack flex={1} justifyContent="center" alignItems="center" padding={is480 ? "1rem" : "2rem"}>
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
          <Stack rowGap=".4rem">
            <Typography variant="h2" fontWeight={600} textAlign="center">AccessCart</Typography>
            <Typography alignSelf="flex-end" color="GrayText" variant="body2">- Shop Anything</Typography>
          </Stack>
        </Stack>

        <Stack mt={4} spacing={2} width={is480 ? "90vw" : '28rem'} component="form" noValidate onSubmit={handleSubmit(handleLogin)}>
          <motion.div whileHover={{ y: -5 }}>
            <TextField
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email"
                }
              })}
              placeholder="Email"
            />
            {errors.email && <FormHelperText sx={{ mt: 1 }} error>{errors.email.message}</FormHelperText>}
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <TextField
              type="password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
            />
            {errors.password && <FormHelperText sx={{ mt: 1 }} error>{errors.password.message}</FormHelperText>}
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton fullWidth sx={{ height: '2.5rem' }} loading={status === 'pending'} type="submit" variant="contained">Login</LoadingButton>
          </motion.div>

          <Stack flexDirection="row" justifyContent="space-between" alignItems="center" flexWrap="wrap-reverse">
            <motion.div whileHover={{ x: 2 }}>
              <Typography mr="1.5rem" sx={{ textDecoration: "none", color: "text.primary" }} to="/forgot-password" component={Link}>
                Forgot password
              </Typography>
            </motion.div>

            <motion.div>
              <Typography sx={{ textDecoration: "none", color: "text.primary" }} to="/signup" component={Link}>
                Don't have an account? <span style={{ color: theme.palette.primary.dark }}>Register</span>
              </Typography>
            </motion.div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
