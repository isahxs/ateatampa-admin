import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackRoutes from './stack';
import CustomDrawer from '../components/customDrawer';

const Drawer = createDrawerNavigator();

export default function Routes() {
 return (
   <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
    }}
   >
    <Drawer.Screen name="Principal" component={StackRoutes} />
   </Drawer.Navigator>
  );
}