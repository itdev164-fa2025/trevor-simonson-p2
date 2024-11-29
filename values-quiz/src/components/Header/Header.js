import * as React from 'react';
import { useContext } from "react";
import { Link } from 'gatsby';
import { AuthContext } from '../../context/AuthContext';
import { Button, Flex, Text } from 'rebass';
import styled from "styled-components"
import { LogoutButton } from '../Button';
import { ThemeConsumer } from "styled-components"

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
const Image = styled.img`
  max-height: 150px;
  margin: 0;
`
const StyledHeader = styled.header`
  margin: 0 auto;
  padding: var(--space-2) var(--size-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.variants.header.primary.backgroundColor};
  color: ${({ theme }) => theme.variants.header.primary.color};
`

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
      <StyledHeader>
          <ThemeConsumer>
            {theme => <Image src={theme.images.mainHeaderImage} />}
          </ThemeConsumer>
          <Text as="h1" fontSize={5} fontWeight="bold">
            Philosophy Quiz
          </Text>

        <Flex>
          {user ? (
            <>
              <StyledButton as={Link} to="/quiz">
                Quiz
              </StyledButton>
              <StyledButton as={Link} to="/profile">
                Profile
              </StyledButton>
              <LogoutButton onClick={logout} />
            </>
          ) : (
            <>
              <StyledButton as={Link} to="/login">
                Login
              </StyledButton>
              <StyledButton as={Link} to="/register">
                Register
              </StyledButton>
            </>
          )}
        </Flex>
      </StyledHeader>
    )
};

export default Header;