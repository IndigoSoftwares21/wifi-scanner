import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput,TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { useState,useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

 function Home() {
    
  const navigation = useNavigation();
  const [wifiPassword, setWifiPassword] = useState('HELLO2439');

  const [fontLoaded, setFontLoaded] = useState(false);
  const loadFont = async () => {
    await Font.loadAsync({
      'poppins-regular': require('./assets/fonts/Poppins-Regular.ttf'),
      'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
    removePassword('wifi');
  }, []);
  const handleInputPress = async () => {
    if (wifiPassword!='') {
        await Clipboard.setStringAsync(wifiPassword);
    }
  };
  const handleScanPress = () => {
    removePassword('wifi')
    navigation.navigate('Scanner');
  };
  // To remove data
    const removePassword = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };
  // To retrieve data
  const getPassword = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setWifiPassword(value)
      }
     else{
        setWifiPassword('');
     }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPassword('wifi');
    });
    return unsubscribe;
  }, [navigation]);


  return (
   
       <SafeAreaView style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.mainText}>Scan QR CODE</Text>
            <Text style={styles.subText}>to get wifi password</Text>
          </View>
          <View style={styles.InputView}>
            <Text style={{width: "90%", fontSize:16, fontWeight:'800',}}>WiFi Password</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={handleInputPress}>
            <TextInput
            style={styles.input}
              placeholder="click to copy after scan"
              placeholderTextColor="#ccc"
              value={wifiPassword}
              editable={false}
            />
            </TouchableOpacity>
            <Text style={{width: "90%", fontSize:12, fontWeight:'100',marginTop:10}}>Click the password to copy</Text>
          </View>
      
            <TouchableOpacity
            onPress={handleScanPress}
             style={styles.buttonView}>
             
                <Entypo name="camera" size={26} color="white" />
                <Text style={styles.scanTxt}>Scan</Text>
              
            </TouchableOpacity>
          
    </SafeAreaView>
   
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: "100%",
    
  },
  box:{
    width: "90%",
    height: 108,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#D9D9D9',
    borderRadius:10,
    marginTop:20
  },
  mainText:{
    fontFamily:'poppins-bold',
    fontSize:26,
  },
  subText:{
    fontFamily:'poppins-regular',
    fontSize:18,
    color:'#4F4F4F'
  },
  input: {
    fontFamily:'poppins-regular',
    height: 58,
    width: "90%",
    borderWidth: 3,
    padding: 10,
    fontSize:20,
    borderColor:'#537EEC',
    borderRadius:10,
    color:"#050505"
  },
  inputContainer:{
    marginTop:5,
    height: 58,
    width: "100%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    color:"#050505"
  },
  InputView:{
    fontFamily:'poppins-regular',
    width: "100%",
    display:'flex',
    alignItems:'center',
    marginTop:20
  },
  buttonView:{
    marginTop:"auto",
    marginBottom:50,
    width: 192,
    height: 56,
    backgroundColor:"#537EEC",
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    borderRadius:10,
    alignItems:'center',
    gap:10
  },
  scanTxt:{
    fontFamily:'poppins-regular',
    fontSize:26,
    color:'#fff'
  }
  ,
  scanner:{
    width: "100%",
    height:500
  }
});

export default Home;