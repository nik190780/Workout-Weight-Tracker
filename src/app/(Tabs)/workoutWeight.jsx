import {FlatList, StyleSheet, View, Text, TextInput, Keyboard } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import FancyButton from "../../components/fancyButton";

async function loadWorkoutsWeight(id) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync(
        'SELECT id, weight, reps, date FROM workoutWeights WHERE workout_id = ?',
        [id]
    )
    return rows
}

async function insertWorkoutWeight(id, weight, reps) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const result = await db.runAsync(
        'INSERT INTO workoutWeights (workout_id, weight, reps) VALUES (?, ?, ?)',
        [id, weight, reps],
        );

    return result
}

async function loadWorkoutName(id) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getFirstAsync('SELECT workoutName FROM workouts WHERE id = ?',
        [id]
    );
    return row?.workoutName ?? ""
}


export default function workoutWeight() {
    const { id } = useLocalSearchParams();
    const [workoutName, setWorkoutName] = useState("");
    const [workoutWeights, setWorkoutWeights] = useState([]);
    const [workoutWeight, setWorkoutWeight] = useState("")
    const [reps, setReps] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)



    // Get the workoutName
    useEffect( () => {
        (async () => {
            try {
                const name = await loadWorkoutName(id)
                setWorkoutName(name)
            } catch(e) {
                console.error("Failed to load workout name", e)
                setError("Failed to load workout name")
            }
        })()
    }, [id])

    // Load all the workouts associated to the workout
    useEffect(() => {
        (async () => {
            try {
                const data = await loadWorkoutsWeight(id);
                setWorkoutWeights(data)
            }catch (e) {
                console.error('Failed to load workout weight', e);
                setError('Failed to load workout weight')
            } finally {
                setLoading(false)
            }
        })();
    }, [id]);

    async function saveWorkoutWeight() {
        setError(null)
        const trimmedWorkoutWeight = workoutWeight.trim()
        const trimmedReps = reps.trim()
        if (!trimmedWorkoutWeight || !trimmedReps) {
            setError("Please enter Both workout weight and reps")
            return
        }
        const weightNumber = parseFloat(trimmedWorkoutWeight)
        const repsNumber = parseInt(trimmedReps, 10)

        if (Number.isNaN(weightNumber) || Number.isNaN(repsNumber)) {
            setError("Weight and Reps Need to be a number")
            return
        }

        try {
            await insertWorkoutWeight(id, weightNumber, repsNumber)
            const data = await loadWorkoutsWeight(id)
            setWorkoutWeights(data)

            setMessage("Workout weight saved!")
            setWorkoutWeight("")
            setReps("")
            Keyboard.dismiss()
        } catch (error) {
            console.error("Failed to save workout weights and reps", error);
            setError("Failed to save workout weights and reps")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{workoutName}</Text>
            <FlatList
                style={styles.list}
                data={workoutWeights}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                        <Text>
                            {item.weight} lbs - {item.reps} reps - {item.date}
                        </Text>
                    )}
            />

            <TextInput
                style={styles.input}
                placeholder="Weight"
                value={workoutWeight}
                onChangeText={setWorkoutWeight}
                keyboardType="numeric"
            />
            <TextInput
            style={styles.input}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            />

            <FancyButton title="Save Changes" onPress={saveWorkoutWeight} />
            {error && <Text style={styles.error}>{error}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    error: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
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
    list: {

        borderWidth: 1,
        borderColor: "orange"
    },
    title : {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    }
})