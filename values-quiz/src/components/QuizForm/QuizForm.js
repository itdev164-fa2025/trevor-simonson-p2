import React, { useState } from 'react';
import { Box, Button, Text} from 'rebass';
import quizData from './quizData.json'; 

const QuizForm = () => {
    const [answers, setAnswers] = useState({});

const handleSubmit = async () => {
    console.log('User Answers:', answers);
    
};

const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
};

return (
    <Box>
    {quizData.map((q) => (
        <Box key={q.id} mb={3}>
            <Text>{q.question}</Text>
            <Box>
                {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} style={{ marginRight: '15px' }}>
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
    <Button mt={3} color="primary" onClick={handleSubmit}>
        Submit
    </Button>
    
    </Box>
);
};

export default QuizForm;