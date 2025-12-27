import {StyleSheet, View, Text, TextInput, Keyboard} from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import  FancyButton  from "../../components/fancyButton";


async function insertWorkout(workoutName) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const result = await db.runAsync(
        'INSERT INTO workouts (workoutName) VALUES (?)',
                [workoutName]
                );
    return result
}




export default function createWorkout() {
    const [workoutName, setWorkoutName] = useState("")
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    async function handleSave() {
        setError(null)
        setMessage(null)

        const trimmed = workoutName.trim()
        if (trimmed.length === 0) {
            setError("Please enter a workout name.")
            return
        }

        try {
            await insertWorkout(trimmed)
            setMessage("Workout saved!")
            setWorkoutName("")
            Keyboard.dismiss()
        } catch (error) {
            console.error("Failed to save workout", error)
            setError("Failed to save workout")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Create A Workout.</Text>
            <TextInput
                style={styles.input}
                placeholder="Workout name (e.g. Bench Press)"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            <FancyButton title="Save Workout" onPress={handleSave} />
            {error && <Text style={styles.error}>{error}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    textStyle: {
        fontSize: 25,
        fontFamily: "Times New Roman",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#7b4141",
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    error: {
        marginTop: 8,
        color: "red",
        textAlign: "center",
    },
    message: {
        marginTop: 8,
        color: "green",
        textAlign: "center",
    }
})