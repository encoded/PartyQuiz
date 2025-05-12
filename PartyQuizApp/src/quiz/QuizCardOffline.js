import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuizTimer, { QuizTimerState } from './QuizTimer';
import QuizCard from './QuizCard';
import QuizTimeOverlay from './QuizTimeOverlay';

const QuizCardOffline = (props) => {
  const { question, options, onQuizEnd, timeLimitSeconds, correctAnswer } = props;
  const waitTimeSeconds = 2;

  const shuffledOptions = useMemo(() => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [question]);

  const correctIndex = correctAnswer != null ? shuffledOptions.findIndex(opt => opt === correctAnswer) : null;

  const [remainingTime, setRemainingTime] = useState(timeLimitSeconds);
  const [answer, setAnswer] = useState(null);

  const quizTimerRef = useRef(null);

  useEffect(() => {
    setAnswer(null);

    if (quizTimerRef.current) {
      quizTimerRef.current.stop();
    }

    const timer = new QuizTimer({
      durationSeconds: timeLimitSeconds,
      onTick: setRemainingTime,
      onQuizTimerStateChanged: (status) => {
        if (status === QuizTimerState.COMPLETED) {
          handleEndQuiz(null);
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

  const onOptionChosen = (index) => {
    if (quizTimerRef.current) {
      quizTimerRef.current.stop();
    }

    handleEndQuiz(index);
  };

  const handleEndQuiz = (selectedIndex) => {
    setTimeout(() => {
      setAnswer(correctAnswer); //correct answer is set only on quiz end
      const isCorrect = selectedIndex === correctIndex;
      onQuizEnd(isCorrect);
    }, waitTimeSeconds * 1000);
  };

  return (
    <QuizCard
      question={question}
      options={shuffledOptions}
      correctAnswer={answer}
      onOptionChosen={onOptionChosen}
      style={props.style}
      disabled={props.disabled}
      renderOptionOverlay = {props.renderOptionOverlay}
      renderCardOverlay={() => {return <QuizTimeOverlay remainingTime={remainingTime}/>}}
    />
  );
};

export default QuizCardOffline;
