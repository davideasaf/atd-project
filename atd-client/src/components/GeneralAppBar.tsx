import React, { Component } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const AppBarContainer = styled.div`
  flex-grow: 1;
`;

const StyledIconButton = styled(IconButton)`
  margin-left: -12;
  margin-right: 20;
` as React.ComponentType<IconButtonProps>;

const StyledTypography = styled(Typography)`
  flex-grow: 1;
` as React.ComponentType<TypographyProps>;

class GeneralAppBar extends Component<{}, {}> {
  render() {
    return (
      <AppBarContainer>
        <AppBar position="static">
          <Toolbar>
            <StyledIconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </StyledIconButton>
            <StyledTypography variant="h6" color="inherit">
              ATD Project Dashboard
            </StyledTypography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </AppBarContainer>
    );
  }
}

export default GeneralAppBar;
