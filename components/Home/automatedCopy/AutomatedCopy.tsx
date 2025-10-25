import React, { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, RadioGroup, FormControlLabel, Radio, FormControl, Typography } from '@mui/material';
import { useTypeAnimation } from '../hooks/useTypeAnimation';
import { styled } from '@mui/system';
import { useAccount } from 'wagmi';
import { useSaveUserData } from '../hooks/useSaveUserData';
import { useSaveBlobData } from '../hooks/useSaveBlobData';



const backgrounds = [
  "url('/graveyard-moon.png')",
  "url('/graveyard.png')",
  "url('/haunted_house.png')",
  "url('/home-background.png')",
  "url('/Home.png')",
  "url('/kitchen.png')",
  "url('/nightmare-before.png')",
  "url('/background.png')",
  "url('/library.png')"
  // ... You can add more image paths as needed
];
interface CenteredContainerProps {
  activeStep: number;
}

const CenteredContainer = styled('div')<CenteredContainerProps>(({ theme, activeStep }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: backgrounds[activeStep % backgrounds.length],
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '90%',
  margin: '40px',
  padding: theme.spacing(2),
  textAlign: 'center',
}));


const questions = [
    {
        questionText: 'What is the name of Dracula`s castle?',
        answerOptions: [
            { answerText: 'Castle Dracul', isCorrect: false },
            { answerText: 'Castle Frankenstein', isCorrect: false },
            { answerText: 'Bran Castle', isCorrect: true },
            { answerText: 'Castle Black', isCorrect: false },
        ],
    },
    {
        questionText: 'What is the name of the legendary Scottish monster?',
        answerOptions: [
            { answerText: 'Bigfoot', isCorrect: false },
            { answerText: 'Chupacabra', isCorrect: false },
            { answerText: 'Jersey Devil', isCorrect: false },
            { answerText: 'Loch Ness Monster', isCorrect: true },
        ],
    },
    {
        questionText: 'Which monster is known for stealing the souls of the dead?',
        answerOptions: [
           
            { answerText: 'Banshee', isCorrect: false },
            { answerText: 'Poltergeist', isCorrect: false },
            { answerText: 'Goblin', isCorrect: false },
            { answerText: 'Grim Reaper', isCorrect: true },
        ],
    },
    {
        questionText: 'What was the profession of Victor Frankenstein?',
        answerOptions: [
            
            { answerText: 'Lawyer', isCorrect: false },
            { answerText: 'Teacher', isCorrect: false },
            { answerText: 'Doctor', isCorrect: true },
            { answerText: 'Engineer', isCorrect: false },
        ],
    },
    {
        questionText: 'Which monster is said to reside in the catacombs of Paris?',
        answerOptions: [
           
            { answerText: 'Gorgon', isCorrect: false },
            { answerText: 'Phantom of the Opera', isCorrect: true },
            { answerText: 'Minotaur', isCorrect: false },
            { answerText: 'Banshee', isCorrect: false },
        ],
    },
    {
        questionText: 'In which country did the legend of the Headless Horseman originate?',
        answerOptions: [
            { answerText: 'Ireland', isCorrect: false },
            { answerText: 'Germany', isCorrect: true },
            { answerText: 'United States', isCorrect: false },
            { answerText: 'England', isCorrect: false },
        ],
    },
    {
        questionText: 'Which monster is known to have a medusa-like appearance?',
        answerOptions: [
            { answerText: 'Gorgon', isCorrect: true },
            { answerText: 'Banshee', isCorrect: false },
            { answerText: 'Harpy', isCorrect: false },
            { answerText: 'Siren', isCorrect: false },
        ],
    },
    {
        questionText: 'What is the traditional name for a Japanese ghost or spirit?',
        answerOptions: [
         
            { answerText: 'Kappa', isCorrect: false },
            { answerText: 'Oni', isCorrect: false },
            { answerText: 'Yokai', isCorrect: true },
            { answerText: 'Tengu', isCorrect: false },
        ],
    },
    {
        questionText: 'Which legendary monster is known to suck the blood of livestock?',
        answerOptions: [
            { answerText: 'Chupacabra', isCorrect: true },
            { answerText: 'Werewolf', isCorrect: false },
            { answerText: 'Vampire', isCorrect: false },
            { answerText: 'Banshee', isCorrect: false },
        ],
    },
    {
        questionText: 'In folklore, what is a Baba Yaga?',
        answerOptions: [
         
            { answerText: 'A ghost', isCorrect: false },
            { answerText: 'A vampire', isCorrect: false },
            { answerText: 'A werewolf', isCorrect: false },
            { answerText: 'A witch', isCorrect: true },
        ],
    },
];



type SetSurveyCompleteFunction = (value: boolean) => void;



const AutomatedCopy: React.FC<{ setSurveyComplete: SetSurveyCompleteFunction }> = ({ setSurveyComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLastQuestionAnswered, setLastQuestionAnswered] = useState(false);
  const { saveUserDataToDB } = useSaveUserData();
  const { typedText, completed } = useTypeAnimation(
    activeStep < questions.length
      ? questions[activeStep].questionText
      : '',
    80
  );

  const router = useRouter();
  useEffect(() => {
    if (isLastQuestionAnswered) {
      setSurveyComplete(true);
      setTimeout(() => {
        router.push('/Mint');
      }, 5000);
    }
  }, [isLastQuestionAnswered, setSurveyComplete, router]);

  const handleOptionSelect = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    if (activeStep < questions.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      console.log('Final Score:', correctAnswers);
      setLastQuestionAnswered(true);
    }
  };

  const getFinalMessage = () => {
    const percentageScore = (correctAnswers / questions.length) * 100;
    if (percentageScore >= 80) {
      return `Congratulations! You have passed the trivia with a score of ${percentageScore}%. Your address has been stored and you are whitelisted to mint up to 2 NFT's on mint day 10.23.2023 @ 7am pst.`;
    } else {
      return 'Unfortunately, you did not pass the trivia. It is necessary to retake the trivia and score at least 65% to be considered for whitelisting.';
    }
  };

  const account = useAccount();
  const id = useId(); // use in htmlFor/id/keys, etc.
  
  useEffect(() => {
      if (isLastQuestionAnswered && correctAnswers / questions.length >= 0.9) {
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => {
            const ipAddress = data.ip;
            const userID = id; // use deterministic ID instead of Date.now()
            const address = account.address || '';
  
            if (address) {
              const userData = { userID, address, ipAddress };
              saveUserDataToDB(userData); // Call your saveUserDataToDB function here
            } else {
              console.error('Address is not defined');
            }
          });
      }
    }, [isLastQuestionAnswered, correctAnswers, account, saveUserDataToDB]);
    
    return (
      <CenteredContainer activeStep={activeStep}>
        <StyledCard>
          <CardContent>
          {isLastQuestionAnswered ? (
            <div>
              <h2>Your Score: {correctAnswers}/{questions.length}</h2>
              <p>{getFinalMessage()}</p>
            </div>
          ) : (
            <FormControl component="fieldset">
              <Typography variant="h4" fontWeight="bold" component="legend">{typedText}</Typography>
              {completed && (
                <RadioGroup aria-label="quiz" name="quiz" onChange={(e) => {
                  const selectedOption = e.target.value;
                  const isCorrect = questions[activeStep].answerOptions.find(
                    option => option.answerText === selectedOption
                  )?.isCorrect;
                  handleOptionSelect(isCorrect || false);
                }}>
                  {questions[activeStep].answerOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option.answerText}
                      control={<Radio />}
                      label={<Typography variant="body1" fontWeight="bold">{option.answerText}</Typography>}
                    />
                  ))}
                </RadioGroup>
              )}
            </FormControl>
          )}
        </CardContent>
      </StyledCard>
    </CenteredContainer>
  );
};

export default AutomatedCopy;