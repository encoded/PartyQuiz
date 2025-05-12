import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LayoutScreen from './LayoutScreen';
import { useClient } from '@src/context/ClientContext';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';
import TextComponent from '@src/components/TextComponent';
import QuizCardTime from '@src/quiz/QuizCardTime';


const ClientGameScreen = () => {
  const {incomingMessageData, sendMessage, ipAddress} = useClient();
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(()=>{
    if(!incomingMessageData)
    {
      return;
    }
    
    if(incomingMessageData.type === SERVER_TO_CLIENT.QUESTION_START)
    {
      setQuestion(incomingMessageData.question);
      setOptions(incomingMessageData.options);
      setTimeLimit(incomingMessageData.timeLimit);
      setCorrectIndex(null); //answer is revealed to the quiz on timeout
      
    } else if (incomingMessageData.type === SERVER_TO_CLIENT.QUESTION_END){
      setCorrectIndex(incomingMessageData.correctIndex);
    } else if (incomingMessageData.type === SERVER_TO_CLIENT.GAME_END){
      const scores = incomingMessageData.scores;

      if (scores && Array.isArray(scores)) {
        console.log("Final Scores:");
        scores.forEach(({ player, score }) => {
          console.log(`Player: ${player}, Score: ${score}`);
        });

        // Try to find the current player's score
        const clientScoreEntry = scores.find(entry => entry.player === ipAddress);
        setFinalScore(clientScoreEntry ? clientScoreEntry.score : 0);
      } else {
        console.log("Game ended, but no scores received.");
        setFinalScore(0);
      }

      setGameEnded(true);
    }
  }, [incomingMessageData]);

  const handleAnswer = (index) => {
    sendMessage({type: CLIENT_TO_SERVER.SUBMIT_ANSWER, selectedIndex: index});
  }
  
  return (
    <LayoutScreen>
      {!gameEnded && question &&
        <QuizCardTime
          question={question}
          options={options}
          correctAnswer={correctIndex !== null ? options[correctIndex] : null}
          onOptionChosen={handleAnswer}
          timeLimitSeconds={timeLimit}
          style={{maxHeight: '70%'}}
        />
      }

      {gameEnded &&
        <View style={styles.endScreen}>
          <TextComponent style={styles.title}>Your Score:</TextComponent>
          <TextComponent style={styles.score}>{finalScore}</TextComponent>
        </View>
      }
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  endScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  }
});

export default ClientGameScreen;
