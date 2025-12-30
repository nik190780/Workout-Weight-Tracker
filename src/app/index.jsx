import { router } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

async function createDatabase() {
    const db = await SQLite.openDatabaseAsync('gym-tracker.db')
    await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workoutName TEXT NOT NULL UNIQUE,
    days TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT (DATE('now'))
    );


    CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    weight REAL NULL,
    reps INTEGER NULL,
    date TEXT NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );
    
    
    CREATE TABLE IF NOT EXISTS workoutWeights(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NULL DEFAULT 0,
    date TEXT NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE    
    );`)


    return db;
}



export default function Index() {

    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                await createDatabase();
                router.replace("/workouts");

            }catch (e) {
              console.error('Failed to initialize database', e)
              setError('Failed to initialize database')
            }
        })();
    }, []);

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        )
    }

  return (
    <View style={styles.container}>
        <Text>Setting things up...</Text>
    </View>
  );
}

  const styles = StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: "#fff"
      }
  })

