// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Button, Alert, Text, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const cellSize = 20;
const gridWidth = Math.floor(width / cellSize);
const gridHeight = Math.floor(height / cellSize);

function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    return { x, y };
}

export default function App() {
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [food, setFood] = useState(generateFoodPosition());
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(moveSnake, 100);
            return () => clearInterval(interval);
        }
    }, [snake, direction, isPlaying]);

    const resetGame = () => {
        setIsPlaying(false);
        setSnake([{ x: 5, y: 5 }]);
        setDirection({ x: 1, y: 0 });
        setFood(generateFoodPosition());
        setScore(0);
    };

    const moveSnake = () => {
        const newPos = {
            x: (snake[0].x + direction.x + gridWidth) % gridWidth,
            y: (snake[0].y + direction.y + gridHeight) % gridHeight,
        };

        if (snake.some(segment => segment.x === newPos.x && segment.y === newPos.y)) {
            setIsPlaying(false);
            Alert.alert("Game Over", `Your score: ${score}`, [{ text: "OK", onPress: resetGame }]);
            return;
        }

        const newSnake = [newPos, ...snake];

        if (newPos.x === food.x && newPos.y === food.y) {
            setFood(generateFoodPosition());
            setScore(score + 1);
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const handleGesture = (event) => {
        const { translationX, translationY } = event.nativeEvent;
        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0 && direction.x !== -1) setDirection({ x: 1, y: 0 });
            else if (translationX < 0 && direction.x !== 1) setDirection({ x: -1, y: 0 });
        } else {
            if (translationY > 0 && direction.y !== -1) setDirection({ x: 0, y: 1 });
            else if (translationY < 0 && direction.y !== 1) setDirection({ x: 0, y: -1 });
        }
    };

    return (
        <GestureHandlerRootView style={styles.root}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.score}>Score: {score}</Text>
                <PanGestureHandler onGestureEvent={handleGesture}>
                    <View style={styles.canvas}>
                        {snake.map((segment, index) => (
                            <View key={index} style={[styles.snake, { left: segment.x * cellSize, top: segment.y * cellSize }]} />
                        ))}
                        <View style={[styles.food, { left: food.x * cellSize, top: food.y * cellSize }]} />
                    </View>
                </PanGestureHandler>
                <Button title={isPlaying ? "Pause" : "Play"} onPress={() => setIsPlaying(!isPlaying)} />
                <Button title="Reset" onPress={resetGame} />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    canvas: {
        width: width,
        height: height - 80,
        backgroundColor: '#fff',
        position: 'relative',
    },
    snake: {
        width: cellSize,
        height: cellSize,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: cellSize,
        height: cellSize,
        backgroundColor: 'red',
        position: 'absolute',
    },
    score: {
        fontSize: 24,
        marginBottom: 10,
    },
});