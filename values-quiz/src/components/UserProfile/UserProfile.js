import React from 'react';
import styled from 'styled-components';
import { Box, Card, Heading, Text, Image } from 'rebass';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import sampleData from './sampleData.json'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler,Tooltip, Legend);

const ProfileContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ChartContainer = styled(Card)`
    width: 100%;
    max-width: 600px;
    padding: 20px;
    margin: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const AlignedThinkerCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;
`;

const UserProfile = () => {

const userData = sampleData; // Temp test data

// refresh reruns code. belongs in put???
// for(const key in sampleData.scores){
    
//     sampleData.scores[key] = Math.trunc(sampleData.scores[key]/3)
//     console.log(sampleData.scores[key])
// }
// console.log(sampleData.scores)

const chartData = {
    labels: [
    'Autonomy',
    'Social Responsibility',
    'Environmental Consciousness',
    'Optimism and Worldview',
    'Spirituality and Transcendence',
    'Interpersonal Connection',
    ],
    datasets: [
    {
        label: 'Philosophy Scores',
        data: Object.values(userData.scores),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
    },
    ],
};

return (
    <ProfileContainer>
        <Heading as="h1" fontSize={[4, 5]} color="primary">
            {userData.user_id}'s Profile
        </Heading>
        <Text as="p" fontSize={2} mt={3} mb={4} >
            {userData.summary}
        </Text>

        <ChartContainer>
            <Radar data={chartData} options={{ maintainAspectRatio: true }} />
        </ChartContainer>

        <AlignedThinkerCard mt={2}>
            <Heading as="h2" fontSize={[4, 5]} color="primary">
                Your values align with:
            </Heading>
            <Image
            src={userData.aligned_thinker.image_url}
            alt={userData.aligned_thinker.name}
            sx={{
                width: 150,
                
                marginBottom: 20,
            }}
            />
            <Heading as="h3" fontSize={3} mb={2}>
                {userData.aligned_thinker.name}
            </Heading>
            <Text as="p" fontSize={2} mb={3} color="text">
                {userData.aligned_thinker.alignment_description}
            </Text>
        </AlignedThinkerCard>
    </ProfileContainer>
);
};

export default UserProfile;