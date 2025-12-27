import { useEffect, useState } from "react";
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import * as SQLite from 'expo-sqlite';

async function getWorkouts() {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync('SELECT * FROM workouts')

    return rows
}

async function deleteWorkout(id) {
    const db = await SQLite.openDatabaseAsync("gym-tracker.db");
    await db.runAsync("DELETE FROM workouts WHERE id = ?", [id]);
}







export default function workouts() {
    const [workouts, setWorkouts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const data = await getWorkouts()
                setWorkouts(data)

            } catch (e) {
                console.error('Failed to load workouts', e)
                setError('Failed to load workouts')
            } finally {
                setLoading(false)
            }

        })();
    }, []);

    async function handleDelete(id) {
        try {
            await deleteWorkout(id);
            // remove from local state so UI updates
            setWorkouts((prev) => prev.filter((w) => w.id !== id));
        } catch (e) {
            console.error("Failed to delete workout", e);
            setError("Failed to delete workout");
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatListContainer}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                          Alert.alert(
                              'Delete Workout',
                              `Are you sure you want to delete ${item.workoutName}`, [
                                  {
                                      text: 'Cancel',
                                      style: 'cancel',
                                  },
                                  {
                                      text: 'Yes',
                                      onPress: () => {
                                          handleDelete(item.id)
                                      }
                                  }
                              ])
                        }
                        style={styles.pressableContainer}
                    >
                        <Text style={styles.textStyle}>
                            {item.workoutName} - {item.date}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#831414"
    },
    error: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
    },
    textStyle: {
        fontSize: 18,
        fontFamily: "Times New Roman",
        textAlign: "center",
        color: "white"
    },
    pressableContainer: {
        borderWidth: 1,
        borderColor: '#56c816',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    flatListContainer: {
        padding: 16,


    }


})