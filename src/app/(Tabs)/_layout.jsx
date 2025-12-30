import { Tabs } from 'expo-router';

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
            name="exercises"
            options={{
                title: "Exercises",
                tabBarHideOnKeyboard: true,
                href: null
            }}/>
            
            <Tabs.Screen
            name="deleteWorkout"
            options={{
                title: "Delete Workout"
            }}/>
        </Tabs>
    )
}
