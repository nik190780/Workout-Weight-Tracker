import { router, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import FancyButton from "../../components/fancyButton";


async function insertWorkout(workoutName, selectedDays) {
    const db = await SQLite.openDatabaseAsync("gym-tracker.db")
  
    return await db.runAsync(
      `INSERT INTO workouts (workoutName, days) VALUES (?, ?)`,
      [workoutName, JSON.stringify(selectedDays)]
    )
  }




export default function createWorkout() {
    const [workoutName, setWorkoutName] = useState("")
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [success, setSuccess] = useState(null)
    const [selectedDays, setSelectedDays] = useState([])
    const { selectedDay } = useLocalSearchParams()

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
        if (!selectedDay) 
          return
      
        const day = Array.isArray(selectedDay) ? selectedDay[0] : selectedDay
      
        // Only add if it's a real day, and not already selected
        if (days.includes(day)) {
          setSelectedDays((prev) => (prev.includes(day) ? prev : [...prev, day]))
        }
      }, [selectedDay])

      const toggleDay = (day) => {
        setSelectedDays((prev) =>
          prev.includes(day)
            ? prev.filter((d) => d !== day) 
            : [...prev, day] 
        )
      }

      async function handleSave() {
        setError(null)
        setMessage(null)
        setSuccess(null)
      
        const trimmed = workoutName.trim()
      
        if (!trimmed) {
          setError("Please enter a workout name.")
          return;
        }
      
        if (selectedDays.length === 0) {
          setError("Please select at least one day.")
          return;
        }
      
        try {
          await insertWorkout(trimmed, selectedDays)
          
          setMessage("Workout saved!")
          setSelectedDays([])
          Keyboard.dismiss()
          setSuccess(true)
        } catch (error) {
          console.error("Failed to save workout", error)
          setError("Failed to save workout")
          Keyboard.dismiss()
          setSuccess(false)
        }
      }

      useEffect(() => {
        if (success) {
          router.push({
            pathname: "/exercises",
            params: { createdWorkout: workoutName }
          })
          setWorkoutName("")
        }
      }, [success])

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Create A Workout</Text>
            <TextInput
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
            />
           <View style={styles.daysWrap}>
                {days.map((day) => {
                    const isSelected = selectedDays.includes(day);

                    return (
                        <Pressable
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={({ pressed }) => [
                            styles.selecteBoxes,
                            isSelected && styles.selectedBox,
                            pressed && { opacity: 0.7 },
                        ]}
                        >
                            <Text  numberOfLines={1} ellipsizeMode="clip" style={[styles.dayText, isSelected && styles.selectedText]}>
                            {day}
                            </Text>
                        </Pressable>
                        );
                })}
            </View>
            
            <FancyButton title="Save Workout" onPress={ () =>  { 
              handleSave()
             }} />
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
    },
    daysWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
        justifyContent: "center"
      },
      
      selecteBoxes: {
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,

      },
      
      selectedBox: {
        backgroundColor: "green",
        borderColor: "green",
      },
      
      dayText: {
        color: "black",
      },
      
      selectedText: {
        color: "white",
        //fontWeight: "bold",
      },
      
})