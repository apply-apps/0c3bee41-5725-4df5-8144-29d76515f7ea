// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Button, ActivityIndicator, View } from 'react-native';
import axios from 'axios';

export default function App() {
    const [heroes, setHeroes] = useState('');
    const [villains, setVillains] = useState('');
    const [plot, setPlot] = useState('');
    const [generatedStory, setGeneratedStory] = useState('');
    const [loading, setLoading] = useState(false);

    const generateStory = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please generate a fairy tale based on given heroes, villains, and plot." },
                    { role: "user", content: `Heroes: ${heroes}, Villains: ${villains}, Plot: ${plot}` }
                ],
                model: "gpt-4o"
            });
            const { data } = response;
            setGeneratedStory(data.response);
        } catch (error) {
            console.error(error);
            setGeneratedStory('Failed to generate story.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Fairy Tale Generator</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Heroes"
                    value={heroes}
                    onChangeText={setHeroes}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Villains"
                    value={villains}
                    onChangeText={setVillains}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Plot"
                    value={plot}
                    onChangeText={setPlot}
                />
                <Button title="Generate Story" onPress={generateStory} />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : (
                    <Text style={styles.storyText}>{generatedStory}</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    scrollView: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    loader: {
        marginVertical: 20,
    },
    storyText: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
    },
});