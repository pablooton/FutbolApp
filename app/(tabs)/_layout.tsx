import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from 'expo-router';


const  TabLayout = () => (
  
    <Tabs>
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="shield" color={color} />,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Players',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
);

export default TabLayout;