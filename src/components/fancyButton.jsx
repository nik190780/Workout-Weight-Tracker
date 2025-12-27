import { Text, Pressable, StyleSheet } from "react-native";

export default function FancyButton ({ title, onPress, style, textStyle}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                style,
            ]}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: "#4b6ef5",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 999,     // pill shape
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,          // Android shadow
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
})