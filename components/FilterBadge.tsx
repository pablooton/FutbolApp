import { Pressable, StyleSheet, Text } from "react-native";

type FilterBadgeProps = {
    label: string;
    active:boolean;
    onPress:() => void;
};
const FilterBadge: React.FC<FilterBadgeProps> = ({label,active,onPress}) =>(
    <Pressable onPress={onPress} style={[styles.container, active ? {backgroundColor: "blue"} : {backgroundColor:"grey"}]}>
        <Text style={styles.text} > {label}</Text>
    </Pressable>

)

const styles = StyleSheet.create({
    container:{
        borderRadius: 10,
        padding: 10,
        minWidth: 50,
        minHeight: 50,
    },
    text:{
        color:"white",
        fontWeight:"bold",
        textAlign:"center",
    },
}
)

export default FilterBadge;