import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useCallback, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import FancyButton from "../../components/fancyButton";

async function loadExercise (exerciseId) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getAllAsync('SELECT * FROM exercises WHERE id = ?',
        [exerciseId]
    )
    return row
}
async function updateExercise(weight, reps, id) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    return await db.runAsync(
        `UPDATE exercises
         SET weight = ?, reps = ?
         WHERE id = ?`,
        [weight, reps, id]
      )
}





export default function ExerciseEdit () { 
    const [exercise, setExercise] = useState(null)
    const [error, setError] = useState(false)
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")

    const {workoutId, exerciseId, nameFromWorkout } = useLocalSearchParams()



    // Get all the exercises associated to workout
    useFocusEffect(
        useCallback(() => {
          let isActive = true
      
          ;(async () => {
            if (!exerciseId) return
            const rows = await loadExercise(Number(exerciseId))
            const first = rows[0] ?? null
            if (!isActive) return
      
            setExercise(first)
            setWeight(first?.weight?.toString() ?? "")
            setReps(first?.reps?.toString() ?? "")
            
          })()
      
          return () => { isActive = false }
        }, [exerciseId])
      )

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
            if (!exerciseId) {
                setError("Workout not loaded yet.")
                return
              }
            await updateExercise(weightNumber, repsNumber, Number(exercise.id))
            const rows = await loadExercise(Number(exerciseId))
            const first = rows[0] ?? null
            setExercise(first)
            setWeight(first?.weight?.toString() ?? "")
            setReps(first?.reps?.toString() ?? "")
            
            Keyboard.dismiss()
            router.replace({
                pathname: "/exercises",
                params: { id: String(workoutId), createdWorkout: nameFromWorkout },
              })
        } catch (e) {
            console.error("There was an error saving exercise", e)
            Keyboard.dismiss()
        }
    }
    //console.log(exercise)
    return (
        <View>
            <Text style={styles.heading}>{ exercise?.exercise_name ?? ""}</Text>
            <Text>Weight</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight}/>
            <Text>Reps</Text>
             <TextInput  style={styles.input} value={reps} onChangeText={setReps}/>

             
        <FancyButton onPress={saveExercise} title="Save Changes"/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    heading: { 
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "#7b4141",
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },

    message: {
        marginTop: 8,
        color: "green",
        textAlign: "center",
    },
})