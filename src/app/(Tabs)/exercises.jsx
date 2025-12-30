import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FancyButton from "../../components/fancyButton";


async function loadExercises(workoutId) { 
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync('SELECT * FROM exercises WHERE workout_id = ?', 
        [workoutId]
    )
    return rows
}

async function loadWorkoutName(id) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getFirstAsync('SELECT workoutName FROM workouts WHERE id = ?',
        [id]
    )
    return row?.workoutName ?? ""
}


export default function workoutWeight() {
    const { id } = useLocalSearchParams()
    const [workoutName, setWorkoutName] = useState("")
    const [exercises, setExercises] = useState([])
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

    // Get all the exercises associated to workout
    useFocusEffect(useCallback(() => { 
        (async () => { 
            try {
                const exercises = await loadExercises(id)
                setExercises(exercises)
            } catch(e) { 
                console.error("Failed to load exercises", e)
                setError("Failed to load exercises")
            }
        }) ()
    }, [])
)



    return (
        <View style={styles.container}>
            <Text style={styles.title}>{workoutName}</Text>
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.flatlistText}>
                        {item.exercise_name} - {item.weight}Lbs - {item.reps}
                    </Text>
                )}
            >

            </FlatList>

            <FancyButton  style={{margin: 10}} title="Create Exercise" onPress={() => {
                router.push({
                    pathname: "/createExercises",
                    params: { id }
                })
            }} 
            />
            <FancyButton  style={{margin: 10}} title="Workout History" onPress={() => { 
                router.push({
                    pathname: "/workoutHistory",
                    params: { id }
                })
            }}
            />
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
    },
    headerText :  { 
        fontSize: 15,
        fontWeight: "bold", 
        paddingTop: 10

    }, 
    flatlistText: { 
        fontSize: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: "Black",
        borderRadius: 100,
        margin: 10,
        minWidth: 50,
       
    }
})