import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnity } from '../providers/unityprovider';

export default function Unity() {
  const {subscribe, postMessage} = useUnity();

  const [showingButton, setShowingButton] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(handleMsg);
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleMsg = (msg) => {
    console.log(msg);
    if(msg == "qr_code_scanned")
    {
      setShowingButton(true);
    }
  }

  return (
    <View style={{ flex: 1 }}>
        <SafeAreaView>
          {showingButton && <Button title='Place Cube' onPress={() => postMessage("place_button_click")}/>}
        </SafeAreaView>
    </View>
  );
}