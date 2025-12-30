import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(Tabs)" options={{ headerShown: false, title: "Workouts" }} />
      <Stack.Screen name="exerciseHistory" options={{ title: "Exercise History" }} />
      <Stack.Screen name="createExercises" options={{ title: "Create Exercises "}} />
    </Stack>
  );
}
