import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: '#000000', height: '100%' }}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            source={images.logo}
            style={{ width: 130, height: 84 }}
            resizeMode='contain'
          /> 
        </View>

        <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 24, color: 'white', fontWeight: '600', textAlign: 'center', marginTop: 30 }}>
            chase{' '}
            <Text style={{ color: 'orange' }}>something.</Text>
          </Text>
          
          <CustomButton 
            title="sign in / sign up."
            handlePress={() => router.push('sign-in')} 
            containerStyle={{ width: '100%', marginTop: 500 }} 
          />
        </View>
      </ScrollView>
      <StatusBar style='light' />
    </SafeAreaView>
  );
}