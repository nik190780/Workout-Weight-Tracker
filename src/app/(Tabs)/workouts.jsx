import { router, useFocusEffect } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from "react-native";


async function getWorkouts() {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    const rows = await db.getAllAsync('SELECT * FROM workouts')

     return rows
}

export default function workouts() {
    const [workouts, setWorkouts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dayPressed, setDayPressed] = useState([])

    useEffect(() => {
        if (Platform.OS === "android") {
          UIManager.setLayoutAnimationEnabledExperimental?.(true);
        }
      }, [])

    const togglePress = (day) => { 
       LayoutAnimation.configureNext({
            duration: 220,
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        })

        setDayPressed((prev) => 
        prev.includes(day)
            ? prev.filter((d) => d !== day) 
            : [...prev, day] 
        )
    }
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]

      


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


    

    return (
        <View style={[styles.container, { flex: 1 }]}>
          {days.map((day) => {
            const isPressed = dayPressed.includes(day);
            
            const workoutsForDay = workouts.filter((w) => {
              try {
                const workoutDays = JSON.parse(w.days ?? "[]"); // convert string -> array
                return Array.isArray(workoutDays) && workoutDays.includes(day);
              } catch {
                return false;
              }
            });
      
            return (
              <View key={day} style={{ marginBottom: 12 }}>
                <Pressable
                    onPress={() => { 
                        togglePress(day)
                    }}
                    style={styles.selecteBoxes}
                >
                    <View style={styles.collapsedContainer}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 2 }}>
                            {day}
                        </Text>
                        <Text style={{ fontSize: 20 }}>{isPressed ? "▾" : "▸"}</Text>
                    </View>
                </Pressable>
      
                {isPressed && (
        <ScrollView>
          <View style={{ marginTop: 8 }}>
            {workoutsForDay.length === 0 ? (
                <Pressable
                    onPress={() => {
                        router.push({
                            pathname: "/createWorkout",
                            params: { selectedDay: day } 
                        })
                        
                    }}
                >
                    <Text style={{ opacity: 0.8, textAlign: "center", color: "blue" }}>No workouts! Press me to get started</Text>
              </Pressable>
            ) : (
              workoutsForDay.map((w) => (
                
                    <Pressable
                    key={`${day}-${w.id}`}
                    style={styles.innerContainer}
                    onPress={() =>
                        router.push({
                        pathname: "/exercises",
                        params: { id: w.id },
                        })
                    }
                    >
                    <Text style={styles.textStyle}>{w.workoutName}</Text>
                    </Pressable>
              ))
            )}
          </View>
        </ScrollView>
        )}
      </View>
    );
  })}
</View>
    )
}
      

const styles = StyleSheet.create({
    container: {
        padding: 16,
        justifyContent: "top",
    },
    innerContainer: { 
        padding: 10, 
        margin: 15,
        alignItems: "center",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 100,
        
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
    collapsedContainer: { 
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    selecteBoxes: {
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,

      },


})