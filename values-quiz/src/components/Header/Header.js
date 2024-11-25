import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, Flex, Text } from 'rebass';
import styled from "styled-components"

const StyledButton = styled(Button)`
    margin: 0 10px;
    padding: 1rem;
    width:7rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    text-decoration: none;
    color: black;
    background-color: gray;
    border-radius: 10px;
    

`

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
      <Flex
        as="nav"
        px={4}
        py={3}
        bg="primary"
        color="black"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text as="h1" fontSize={5} fontWeight="bold">
          Philosophy Quiz
        </Text>

        <Flex>
          <StyledButton as={Link} to="/quiz">
            Quiz
          </StyledButton>

          {user ? (
            <>
              <StyledButton as={Link} to="/profile">
                Profile
              </StyledButton>
              <StyledButton onClick={logout}>Logout</StyledButton>
            </>
          ) : (
            <StyledButton
              as={Link}
              to="/login"
            >
              Login
            </StyledButton>
          )}
        </Flex>
      </Flex>
    )
};

export default Header;