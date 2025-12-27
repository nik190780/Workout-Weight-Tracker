import { router, useFocusEffect } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

async function getWorkouts() {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync('SELECT * FROM workouts')

     return rows
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


    useFocusEffect(useCallback(() => {
        let isActive = true

        const fetchWorkouts = async () => {
            try {
                setLoading(true)
                const data = await getWorkouts()
                if (isActive) {
                    setWorkouts(data)
                    setError(null)
                }
            } catch (e) {
                console.error('Failed to load workouts', e)
                if (isActive) setError('Failed to load workouts')
            } finally {
                if (isActive) setLoading(false)
            }
        }

        fetchWorkouts()
        return () => {
            isActive = false
        }
    }, [])
)

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        )

    }


    if (workouts.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>No workouts exist yet.</Text>
            </View>
        );
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
                            router.push({
                               pathname: "/workoutWeight",
                                params: { id: item.id}
                            })
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
    },
    pressableContainer: {
      borderWidth: 1,
      borderColor: '#542fd8',
      borderRadius: 20,
      borderShadowColor: '#250101',
      padding: 16,
      marginBottom: 12,
    },
    flatListContainer: {
      padding: 16,


    }


})