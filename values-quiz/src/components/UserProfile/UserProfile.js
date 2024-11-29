import React, { useContext, useEffect, useState } from "react"
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
import { AuthContext } from "../../context/AuthContext"



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
    const { getResults, user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      const results = await getResults()
      if (results) {
        setUserData(results)
      }
    }

    fetchResults()
  }, [getResults])

  if (loading || !userData) {
    return <p>Loading...</p>
  }
    const scores = [
      userData["autonomy_score"],
      userData["social_responsibility_score"],
      userData["environmental_consciousness_score"],
      userData["optimism_and_worldview_score"],
      userData["spirituality_and_transcendence_score"],
      userData["interpersonal_connection_score"],
    ]
    console.log(userData);
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
            data: scores,
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
          {user.name}'s Profile
        </Heading>
        <Text as="p" fontSize={2} mt={3} mb={4}>
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
            src={userData.thinker_image_url}
            alt={userData.thinker_name}
            sx={{
              width: 150,

              marginBottom: 20,
            }}
          />
          <Heading as="h3" fontSize={3} mb={2}>
            {userData.thinker_name}
          </Heading>
          <Text as="p" fontSize={2} mb={3} color="text">
            {userData.thinker_description}
          </Text>
        </AlignedThinkerCard>
      </ProfileContainer>
    )
};

export default UserProfile;