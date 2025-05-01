import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuizTimer, { QuizTimerState } from './QuizTimer';

const QuizCard = ({
  question,
  options,
  answer,
  onQuizEnd,
  timeLimitSeconds
}) => {
  const waitTimeSeconds = 2;

  const shuffledOptions = useMemo(() => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [question]);

  const correctIndex = shuffledOptions.findIndex(opt => opt === answer);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(timeLimitSeconds);

  const quizTimerRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(null);

    if (quizTimerRef.current) {
      quizTimerRef.current.stop();
    }

    const timer = new QuizTimer({
      durationSeconds: timeLimitSeconds,
      onTick: setRemainingTime,
      onQuizTimerStateChanged: (status) => {
        if (status === QuizTimerState.COMPLETED && selectedIndex === null) {
          setSelectedIndex(-1);
          handleEndQuiz();
        }
      }
    });

    quizTimerRef.current = timer;
    timer.start();

    setRemainingTime(timeLimitSeconds);

    return () => {
      timer.stop();
    };
  }, [question]);

  const onOptionPress = (index) => {
    setSelectedIndex(index);

    if (quizTimerRef.current) {
      quizTimerRef.current.stop();
    }

    handleEndQuiz();
  };

  const handleEndQuiz = () => {
    setTimeout(() => {
      const isCorrect = selectedIndex === correctIndex;
      onQuizEnd(isCorrect);
      setSelectedIndex(null);
    }, waitTimeSeconds * 1000);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.timeText}>{remainingTime}</Text>

      <View style={styles.questionContainer}>
        <Text style={[styles.text, styles.question]}>{question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {shuffledOptions.map((option, index) => {
          const isSelected = index === selectedIndex;
          const isCorrect = index === correctIndex;

          let buttonStyle = styles.optionButton;
          if (selectedIndex !== null) {
            if (isCorrect) {
              buttonStyle = [buttonStyle, styles.correctAnswer];
            } else if (isSelected) {
              buttonStyle = [buttonStyle, styles.wrongAnswer];
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => onOptionPress(index)}
              disabled={selectedIndex !== null}
            >
              <Text style={[styles.text, styles.optionText]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff'
  },
  timeText: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 50,
    marginTop: 50,
    textAlign: 'center',
    fontSize: 32,
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginVertical: 5,
    width: '50%',
  },
  correctAnswer: {
    backgroundColor: '#50D960',
  },
  wrongAnswer: {
    backgroundColor: '#EE4B2B',
  },
  optionText: {
    fontSize: 16,
  },
});

export default QuizCard;
