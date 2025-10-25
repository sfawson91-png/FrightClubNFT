import React from 'react';
import { Container, Typography, IconButton, Link } from '@mui/material';
import { styled } from '@mui/system';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const FooterContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#0000000',
  color: '#fff',
  position: 'fixed',
  bottom: 40,
  left: 0, // Ensure it starts from the leftmost part of the screen
  width: '100%',
  display: 'flex',
  justifyContent: 'center', // Center children horizontally
  alignItems: 'center',
  flexDirection: 'row',
  boxSizing: 'border-box', // Include padding in width calculations
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const ContentWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%', // Make sure the wrapper takes the full width
  maxWidth: '1200px', // Set a reasonable max width for the content
  boxSizing: 'border-box', // Include padding in width calculations
});

const ContactInfo = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '10px',
  },
}));

const SocialIcons = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const LegalLinks = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
      <ContactInfo variant="body2">
        support/contact: <br /> saulweiloveman@gmail.com <br /> 
      </ContactInfo>
      <SocialIcons>
        <IconButton color="inherit" aria-label="Twitter" href="https://www.twitter.com/FrightClub_NFT">
          <Twitter />
        </IconButton>
      </SocialIcons>
      <LegalLinks>
        <Link href='https://twitter.com/saul_loveman' underline="none">
         MADE BY:
        </Link>
        <Link  underline="none" href="https://twitter.com/saulloveman">
          FOAM Softwares
        </Link>
     
        <Link href="/user-agreement" underline="none">
      
        </Link>
      </LegalLinks>
      </ContentWrapper>
    </FooterContainer>
  );
};

export default Footer;