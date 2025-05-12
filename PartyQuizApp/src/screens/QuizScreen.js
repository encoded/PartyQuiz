import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QuizCardOffline from '@src/quiz/QuizCardOffline';
import LayoutScreen from './LayoutScreen';
import TextComponent from '@src/components/TextComponent';

const mockQuizData = [
  {
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    incorrect_answers: ['London', 'Rome', 'Berlin'],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    correct_answer: 'Mars',
    incorrect_answers: ['Earth', 'Jupiter', 'Saturn'],
  },
];

export default function QuizScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const timeBetweenQuestionsSeconds = 2;

  const handleAnswer = (isCorrect) => {
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < mockQuizData.length) {
        setCurrentIndex(nextIndex);
      } else {
        setShowResult(true);
      }
    }, timeBetweenQuestionsSeconds * 1000);
  };

  if (showResult) {
    return (
      <LayoutScreen>
        <TextComponent style={styles.resultText}>Quiz Finished!</TextComponent>
      </LayoutScreen>
    );
  }

  const currentQuestion = mockQuizData[currentIndex];

  return (
    <LayoutScreen>
      <QuizCardOffline
        question={currentQuestion.question}
        options={[
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ]}
        correctAnswer={currentQuestion.correct_answer}
        onQuizEnd={handleAnswer}
        timeLimitSeconds={10}
        style={{maxHeight: '70%'}}
      />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 24,
    textAlign: 'center'
  },
});
