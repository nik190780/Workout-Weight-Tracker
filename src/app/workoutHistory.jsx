import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


async function loadWorkoutsWeight(id) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync(
        'SELECT id, weight, reps, date FROM workoutWeights WHERE workout_id = ?',
        [id]
    )
    return rows
}

async function loadWorkoutName(id) {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const row = await db.getFirstAsync('SELECT workoutName FROM workouts WHERE id = ?',
        [id]
    );
    return row?.workoutName ?? ""
}


export default function workoutHistory() {

    const {id} = useLocalSearchParams();
    const [workout, setWorkout] = useState([])
    const [workoutName, setWorkoutName] = useState("")
    const [loading, setLoading] = useState(true)

    const reload = useCallback(async () => {
        try {
          setLoading(true);
          const [name, data] = await Promise.all([
            loadWorkoutName(id),
            loadWorkoutsWeight(id),
          ]);
          setWorkoutName(name)
          setWorkout(data)
        } catch (e) {
          console.error("Failed to load history", e)
        } finally {
          setLoading(false);
        }
      }, [id])

      useFocusEffect(
        useCallback(() => {
          reload()
        }, [reload])
      )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{workoutName}</Text>
                
                <FlatList
                    style={styles.list}
                    data={workout}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                            <Text style={styles.flatlistText}>
                                {item.weight} lbs - {item.reps} reps - {item.date}
                            </Text>
                        )}
                />

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
        marginTop: 10,
        borderColor: "black",
        borderWidth: 1
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
        padding: 10
    }
})

