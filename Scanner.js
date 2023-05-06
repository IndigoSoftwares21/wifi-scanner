import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput,TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { useState,useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useNavigation } from '@react-navigation/native';



const Scanner = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    
    const storePassword = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          alert(error);
        }
      };
  
    const askForCameraPermission =()=>{
      (async ()=>{
        const {status} = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  
    //request Permission
    useEffect(()=>{
      askForCameraPermission();
    },[]);
  
    const handleCodeScaned =({type,data})=>{
      setScanned(true);
      passwordExtractor(data);
      navigation.navigate('Home');
    }

    const passwordExtractor = (data) => {
        const qrCodeData = data;
        const regex = /WIFI:(?:S:[^;]+;)?T:(WEP|WPA|nopass|none);P:([^;]+)(;H:[^;]+)?/i;
        const match = qrCodeData.match(regex);
        if (match) {
          const password = match[2];
          storePassword('wifi', password);
        } else {
          passwordExtractor2(data);
        }
      }
      const passwordExtractor2 = (data) => {
        const qrCodeData = data;
        const regex = /WIFI:T:(WEP|WPA|nopass|none);S:[^;]+;P:([^;]+)(;H:[^;]+)?/i;
        const match = qrCodeData.match(regex);
        if (match) {
          const password = match[2];
          storePassword('wifi', password);
        } else {
          alert("Invalid WiFi QR Code");
        }
      }
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  return (
    <SafeAreaView style={styles.container}>
            <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleCodeScaned}
            style={StyleSheet.absoluteFillObject}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  scanner:{
    width: "100%",
    height:"100%"
  },
  container:{
    flex:1,
  }
  });
export default Scanner