import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
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
    const ACTION_WIDTH = 280
    const { id, createdWorkout } = useLocalSearchParams()
    const [workoutName, setWorkoutName] = useState("")
    const [exercises, setExercises] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)


    const deleteExercise = async (exerciseId) => {
        const db = await SQLite.openDatabaseAsync("gym-tracker.db")
        await db.runAsync("DELETE FROM exercises WHERE id = ?", [exerciseId])
        setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
    
    }
    // Get the workoutName
    useEffect( () => {
        (async () => {
            try {
                let name = await loadWorkoutName(id)

                if (name === "") 
                    name = createdWorkout

                setWorkoutName(name)
            } catch(e) {
                console.error("Failed to load workout name", e)
                setError("Failed to load workout name")
            }
        })()
    }, [id])

    // Get all the exercises associated to workout
    useFocusEffect(
        useCallback(() => {
          let isActive = true;
      
          (async () => {
            try {
              if (!id) return
              const exercises = await loadExercises(id)
              if (isActive) setExercises(exercises)
            } catch (e) {
              console.error("Failed to load exercises", e)
              if (isActive) setError("Failed to load exercises")
            }
          })()
      
          return () => {
            isActive = false;
          }
        }, [id])
      )

      
      const renderRightActions = () => {
        return (
            <View style={[styles.rightAction, { width: ACTION_WIDTH }]}>
                <Text style={styles.rightActionText}>Delete</Text>
            </View>
        )
      }


      const goToExerciseEdit = (exerciseId) => { 
        router.push({
            pathname: '/exerciseEdit',
            params: { workoutId: id, exerciseId: String(exerciseId), nameFromWorkout: workoutName },
        })
      }

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>{workoutName}</Text>
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.rowWrapper}>
                        <Swipeable
                            renderRightActions={renderRightActions}
                            rightThreshold={ACTION_WIDTH * 0.7}
                            onSwipeableOpen={(direction) => {
                                console.log("opened:", direction);
                                if (direction === "left") deleteExercise(item.id);
                            }}
                        >
                            <Pressable onPress={() => { 
                                goToExerciseEdit(item.id)
                            }}>
                        <View style={styles.rowContent}>
                                <Text style={styles.rowText}>
                                {item.exercise_name} - {item.weight}Lbs - {item.reps} Reps
                                </Text>
                        </View>
                            </Pressable>
                        </Swipeable>
                    </View>
                )}
            >

            </FlatList>

            <FancyButton  style={{margin: 10}} title="Create Exercise" onPress={() => {
                router.push({
                    pathname: "/createExercises",
                    params: { id, nameFromWorkout: workoutName }
                })
            }} 
            />
            {/** TODO: Need to figure out if Im keeping workout history and how I want history to look like. */}
            {/**<FancyButton  style={{margin: 10}} title="Workout History" onPress={() => { 
                router.push({
                    pathname: "/workoutHistory",
                    params: { id }
                })
            }}
        /> **/}
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
       
    },
    row: { paddingHorizontal: 6 },
    rowWrapper: {
        marginVertical: 8,
        borderRadius: 18,
        overflow: "hidden",      
      },
      
      rowContent: {
        backgroundColor: "white",
        paddingVertical: 14,
        paddingHorizontal: 16,
      },
      
      rowText: {
        fontSize: 15,
      },
      rightAction: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",        
      },
      
      rightActionText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
      },
})