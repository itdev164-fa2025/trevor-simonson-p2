import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import QuizForm from '../components/QuizForm/QuizForm';

const Login = () => {
    const { user } = useContext(AuthContext);
        console.log(user);

        return (

            <QuizForm/>
            
        );

        

};

export default Login;