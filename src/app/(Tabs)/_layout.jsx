import { Tabs } from "expo-router";

export default function TabLayout() {
    return(
        <Tabs>
            <Tabs.Screen
            name="workouts"
            options={{
                title: "Workouts"
            }}/>
            <Tabs.Screen
            name="createWorkout"
            options={{
             title: "Create Workout"
            }}/>
            <Tabs.Screen
            name="workoutWeight"
            options={{
                title: "Reps and Weight",
                tabBarHideOnKeyboard: true
            }}/>
            <Tabs.Screen
            name="deleteWorkout"
            options={{
                title: "Delete Workout"
            }}/>
        </Tabs>
    )
}
