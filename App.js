import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { auth, firebase } from './firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Button title="Çıkış Yap" onPress={handleSignOut} />
    </View>
  );
};

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Yardım için bize e-posta gönderin: example@example.com</Text>
      <Text style={styles.message}>Diğer iletişim bilgileri: 123-456-***</Text>
      <Text style={styles.message}>Adres: Örnek Cadde, No: 123, Şehir, Ülke</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await user.delete();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = () => {
    console.log('Profil bilgileri kaydedildi:', firstName, lastName, birthdate);
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Email: {user.email}</Text>
      <View style={styles.profileContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adınız"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Soyadınız"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Doğum Tarihiniz"
          value={birthdate}
          onChangeText={setBirthdate}
        />
      </View>
      <Button title="Profil Bilgilerini Kaydet" onPress={handleSaveProfile} />
      <Button title="Hesabı sil ve çıkış yap" onPress={handleDeleteAccount} />
      <Text style={styles.output}>
        Ad: {firstName} Soyad: {lastName} Doğum Tarihi: {birthdate}
      </Text>
    </View>
  );
};

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [resetInProgress, setResetInProgress] = useState(false);

  const handleResetPassword = async () => {
    try {
      setResetInProgress(true);
      await auth.sendPasswordResetEmail(email);
      alert('Şifre sıfırlama e-postası gönderildi. Lütfen e-posta adresinizi kontrol edin.');
      navigation.navigate('Auth');
    } catch (error) {
      console.error(error);
      alert('Şifre sıfırlama işlemi başarısız oldu.');
    } finally {
      setResetInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title={resetInProgress ? 'Şifre Sıfırlanıyor...' : 'Şifre Sıfırlama E-postası Gönder'}
        onPress={handleResetPassword}
        disabled={resetInProgress}
      />
    </View>
  );
};

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignUp = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert('Başarılı giriş yaptınız.');
    } catch (error) {
      console.error(error);
      alert('Giriş hatalı.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Sign In" onPress={handleLogin} />
      <Button
        title="Şifremi Unuttum"
        onPress={() => navigation.navigate('ResetPassword')}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: 'Şifre Sıfırlama' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Yardım" component={HelpScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  profileContainer: {
    width: '100%',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  output: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
