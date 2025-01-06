import { View, Text, ScrollView } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import {images} from '../../constants';
import { Link } from 'expo-router'; 
import { signIn } from '../../lib/appwrite';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router'; 
 

const SignIn = () => {
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  const [isSubmitting, is, setis] = useState(false)

    const submit = async  () => {

    if( !form.email || !form.password) {
      Alert.alert('Please fill in all fields');
    }

    setIsSubmitting(true);

    
    try {
      await signIn  (form.email, form.password );
    // set it to global state 

    router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <SafeAreaView style={{ backgroundColor: '#242424', height: '100%' }}>
      <ScrollView>
        <View style={{ width: '100%', justifyContent: 'center', minHeight: '5vh', paddingHorizontal: 20, marginVertical: 6 }}>
          <Text style={{ fontSize: 24, color: 'white', fontWeight: '600', marginTop: 10, fontFamily: 'psemibold' }}>
            sign in to barCoded.
          </Text>
          <FormField 
            title="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginTop: 7 }}
            keyboardType="email-address"
          />
          <FormField 
            title="password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={{ marginTop: 7 }}
          />

          <CustomButton
          title="sign in"
          handlePress = {submit} 
          containerStyle="mt-7"
          isLoading = {isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2 ">
            <Text className="text-lg text-secondary font-pregular"> 
              don't have an account?
            </Text>
            <Link href="/sign-up" className = "text-lg font-psemibold text-orange">sign up.</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn; 