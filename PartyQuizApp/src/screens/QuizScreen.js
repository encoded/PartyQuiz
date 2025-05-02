import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QuizCard from '@src/quiz/QuizCard'; // assume QuizCard is in the same folder
import LayoutScreen from './LayoutScreen';

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

  const handleAnswer = (isCorrect) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < mockQuizData.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Quiz Finished!</Text>
      </View>
    );
  }

  const currentQuestion = mockQuizData[currentIndex];

  return (
    <LayoutScreen>
      <QuizCard
        question={currentQuestion.question}
        options={[
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ]}
        answer={currentQuestion.correct_answer}
        onQuizEnd={handleAnswer}
        timeLimitSeconds={10}
      />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
  },
});
