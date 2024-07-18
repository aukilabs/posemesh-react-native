import { Slot } from "expo-router";
import UnityProvider from "../providers/unityprovider";

export default function MainLayout()
{
    return <UnityProvider><Slot/></UnityProvider>
}