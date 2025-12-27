import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(Tabs)" options={{ headerShown: false, title: "Workouts" }} />
      <Stack.Screen name="workoutHistory" options={{ title: "Workout History" }} />
    </Stack>
  );
}
