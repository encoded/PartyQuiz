import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LayoutScreen from './LayoutScreen';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';
import TextComponent from '@src/components/TextComponent';
import { useHost } from '@src/context/HostContext';
import PlayerOptionOverlay from '@src/components/PlayerOptionOverlay';
import QuizCardTime from '@src/quiz/QuizCardTime';


const HostGameScreen = () => {
  const { incomingMessageData, players, sendMessage } = useHost();
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [answersByPlayer, setAnswersByPlayer] = useState({}); // mapo player - optrion index
  const [gameEnded, setGameEnded] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  
  useEffect(()=>{
    if(!incomingMessageData)
    {
      return;
    }
    
    if(incomingMessageData.type === SERVER_TO_CLIENT.QUESTION_START)
    {
      setAnswersByPlayer({});
      setQuestion(incomingMessageData.question);
      setOptions(incomingMessageData.options);
      setTimeLimit(incomingMessageData.timeLimit);
      setCorrectIndex(null);
      
    } else if (incomingMessageData.type === SERVER_TO_CLIENT.QUESTION_END) {
      const { correctIndex, summary } = incomingMessageData;
    
      // Use previously collected answers before clearing them
      setCorrectIndex(correctIndex);
    
      const updatedAnswers = {};
      if (summary && Array.isArray(summary)) {
        summary.forEach(({ player, index }) => {
          updatedAnswers[player] = index;
        });     
      }
    
      setAnswersByPlayer(updatedAnswers);

    } else if (incomingMessageData.type === SERVER_TO_CLIENT.GAME_END){
      const scores = incomingMessageData.scores;

      if (scores && Array.isArray(scores)) {
        const mergedScores = scores.map(({ player, score }) => {
          const matchedPlayer = players.find(p => p.ip === player);
          return {
            name: matchedPlayer?.name || player,
            score,
          };
        });

        setFinalScore(mergedScores);
      } else {
        console.log("Game ended, but no scores received.");
        setFinalScore([]);
      }

      setGameEnded(true);
    }
  }, [incomingMessageData]);
  
  return (
    <LayoutScreen>
      {!gameEnded && question &&
        <QuizCardTime
          question={question}
          options={options}
          correctAnswer={correctIndex !== null ? options[correctIndex] : null}
          timeLimitSeconds={timeLimit}
          style={{maxHeight: '70%'}}
          disabled={true}
          renderOptionOverlay={(index) => {
            return Object.entries(answersByPlayer || {}).map(([playerIp, answerIndex]) => {
              if (answerIndex !== index) return null;
              const player = players.find(p => p.ip === playerIp);
              const name = player?.name || '?';
              return (
                <PlayerOptionOverlay key={playerIp} name={name[0]}/>
              );
            });
          }}
        />
      }

      {gameEnded &&
        <>
          <TextComponent style={styles.title}>Final Scores:</TextComponent>
          {finalScore?.map(({ name, score }, index) => (
            <View key={index} style={styles.scoreRow}>
              <TextComponent style={styles.playerName}>{name}</TextComponent>
              <TextComponent style={styles.score}>{score}</TextComponent>
            </View>
          ))}
        </>  
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 40,
    textAlign: 'right',
  }  
});

export default HostGameScreen;
