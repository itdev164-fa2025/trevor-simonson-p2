import React, { useState, useContext } from 'react';
import { Box, Button, Text} from 'rebass';
import quizData from './quizData.json'; 
import { AuthContext } from '../../context/AuthContext';

import styled from "styled-components"

const StyledButton = styled(Button)`
  margin: 0 10px;
  padding: 1rem;
  width: 7rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  color: black;
  background-color: gray;
  border-radius: 10px;
`

const StyledBox = styled(Box)`
    align-items: center;
    justify-content: center;
`

const QuizForm = () => {
    const [answers, setAnswers] = useState({});
    const { user, submitAnswers } = useContext(AuthContext)

    const handleSubmit = async (userId) => {
        console.log('User Answers:', answers);
        submitAnswers(userId, answers)
        
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };


    return (
        <StyledBox>
            {quizData.map(q => (
                <Box key={q.id} mb={3}>
                <Text>{q.question}</Text>
                <Box>
                    {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} style={{ marginRight: "15px" }}>
                        <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={value}
                        checked={answers[q.id] === value}
                        onChange={() => handleAnswerChange(q.id, value)}
                        />
                        {value}
                    </label>
                    ))}
                </Box>
                </Box>
            ))}
            <StyledButton
                mt={3}
                color="primary"
                onClick={()=>handleSubmit(user.id)}
            >
                Submit
            </StyledButton>
        </StyledBox>
    )
};


export default QuizForm;