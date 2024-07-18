import { EventEmitter } from "@/utils/EventEmitter";
import UnityView from "@azesmway/react-native-unity";
import { createContext, useContext, useEffect, useRef } from "react";
import { View } from "react-native";


const Context = createContext(null);

export const UnityProvider = ({ children }) => {
  const unityRef = useRef(null);
  const eventEmitter = new EventEmitter();
  const subscribe = (callback) => {
    return eventEmitter.subscribe("UNITY_MESSAGE", callback);
  };

  const postMessage = (message) => {
    unityRef.current?.postMessage(
      "ReactNativeBridge", // Unity GameObject name
      "MessageFromReact", // method name on any script attached to that GameObject
      message // payload string
    );
  };
    const onUnityMessage = (unityMessage) => {
    eventEmitter.publish("UNITY_MESSAGE", unityMessage.nativeEvent.message);
  };

  useEffect(() => {
    const unsubscribe = subscribe(handleMsg);
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleMsg = (msg) => {
   console.log(msg);
  };

  return (
    <Context.Provider value={{ subscribe, postMessage }}>
      <View
        style={{
          height: "100%",
          position: "absolute",
          width: "100%",
        }}
      >
        <UnityView
          ref={unityRef}
          style={{ flex: 1 }}
          onUnityMessage={onUnityMessage}
        />
      </View>
      {children}
    </Context.Provider>
  );
};

export const useUnity = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useUnity must be used within a UnityProvider");
  }
  return {
    subscribe: context?.subscribe,
    postMessage: context?.postMessage,
  };
};

export default UnityProvider;