import { Palette } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabTwoScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Explore</Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.sageShadow,
    
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
