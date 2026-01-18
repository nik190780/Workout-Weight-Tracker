import { useLocalSearchParams } from "expo-router"
import * as SQLite from "expo-sqlite"
import { useEffect, useState } from "react"
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native"
import FancyButton from "../components/fancyButton"



async function saveExercises(workoutId, exerciseName, weight, reps) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    return await db.runAsync(
        `INSERT INTO exercises (workout_id, exercise_name, weight, reps) VALUES (?, ?, ?, ?)`,
        [workoutId, exerciseName, weight, reps]
    )
}

async function loadWorkoutName(workoutId) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getFirstAsync(
        'SELECT workoutName FROM workouts WHERE id = ?',
        [workoutId]
    )
    return row?.workoutName ?? "No Name"
}

async function getWorkoutId(workoutNameFromCreation) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getFirstAsync(
        'SELECT id FROM workouts WHERE workoutName = ?',
        [workoutNameFromCreation]
    )
    return row?.id ?? null
}

    

export default function createExercises () { 
    const [reps, setReps] = useState(0)
    const [weight, setWeight] = useState(0)
    const [exerciseName, setExerciseName] = useState("")
    const [workoutName, setWorkoutName] = useState("")
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [workoutIdFromCreation, setWorkoutIdFromCreation] = useState(null)

    // Get the workout id passed from exercises
    const { id, nameFromWorkout } = useLocalSearchParams()
    useEffect(() => {
        if (id) return;                 // already have an id, nothing to do
        if (!nameFromWorkout) return;   // no name to look up
      
        (async () => {
          try {
            const foundId = await getWorkoutId(nameFromWorkout)
            setWorkoutIdFromCreation(foundId)
          } catch (e) {
            console.error("Failed to get workout id", e)
          }
        })()
      }, [id, nameFromWorkout])

      const workoutId = id ?? workoutIdFromCreation

    // function to save the exercise onces the user press the save button
    async function saveExercise () { 
        setError(null)
        const trimmedExerciseWeight = weight.trim()
        const trimmedReps = reps.trim()
        if (!trimmedExerciseWeight || !trimmedReps) {
            setError("Please enter Both workout weight and reps")
            return
        }
        const weightNumber = parseFloat(trimmedExerciseWeight)
        const repsNumber = parseInt(trimmedReps, 10)
        
        if (Number.isNaN(weightNumber) || Number.isNaN(repsNumber)) {
            setError("Weight and Reps Need to be a number")
            return
        }

        try {
            if (!workoutId) {
                setError("Workout not loaded yet.")
                return
              }
            await saveExercises(workoutId, exerciseName, weight, reps)
            setMessage("Exercise saved!")
            setExerciseName("")
            setWeight("")
            setReps("")
            Keyboard.dismiss()
        } catch (e) {
            console.error("There was an error saving exercise", e)
            Keyboard.dismiss()
        }
    }

    useEffect(() => {
        if (!workoutId) return
      
        (async () => {
          try {
            const name = await loadWorkoutName(workoutId)
            setWorkoutName(name)
          } catch (e) {
            console.error("Failed to load workout name", e)
          }
        })()
      }, [workoutId])

    return (
        <View>
            {/** Header name for the workout*/}
            <Text style={styles.title}> {workoutName} </Text>

            <Text style={styles.inputHeading}>Exercise Name</Text>
            <TextInput
                style={styles.input}
                value={exerciseName}
                onChangeText={setExerciseName}
            />
            
            <Text style={styles.inputHeading}>Weight</Text>
            <TextInput 
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"

            />
            
            <Text style={styles.inputHeading}>Reps</Text>
            <TextInput 
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
            />
            
            <FancyButton
                title="Save Exercise"
                onPress={() => saveExercise()}
            >
            </FancyButton>
            {error && <Text style={styles.error}>{error}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    },
    inputHeading: { 
        fontSize: 15,
        fontWeight: "600"
    }
    
})