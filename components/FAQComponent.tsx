
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
       
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            When is mint?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" align="left">
            9am PST on October 25th
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            What is MintPrice?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" align="left">
            Free mint
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            What is the total supply of the collection?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" align="left">
           3131 animated PFP`s
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            How can I get on the whitelist
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" align="left">
            Public mint
          </Typography>
        </AccordionDetails>
      </Accordion>
{/* FAQ 6 */}
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      What are the royalties on the collection.
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography variant="body1" align="left">
      2%
    </Typography>
  </AccordionDetails>
</Accordion>
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      How much will gas be?
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography variant="body1" align="left">
        The smart contract has been optimized for minting in high traffic and should be under 3 dollars in high traffic and most likely around 1 dollar to mint.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
         Is the smart contract safe?
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography variant="body1" align="left">
        Yes the smart contract is safe and written by a seasoned solidity developer.  You will be able to see the code on etherscan before you mint. We encourage you to have a friend or chatGPT look it over for you. 
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      Can these NFTs be transferred across different blockchains?
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography variant="body1" align="left">
        At this time no but anything is possible in the future and the developement team is capable. This would depend on the community and what it wants.
    </Typography>
  </AccordionDetails>
</Accordion>
    </Container>
  );
};

export default FAQ;