// import {
//     View,
//     Text,
//     StyleSheet,
//     Pressable,
//     Linking,
//     Animated,
//     Easing,
// } from 'react-native';
// import { useEffect, useRef, useState } from 'react';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
//
// export default function EmergencyBar() {
//     const insets = useSafeAreaInsets();
//     const translateX = useRef(new Animated.Value(0)).current;
//     const [contentWidth, setContentWidth] = useState(0);
//
//     const callNumber = (number: string) => {
//         Linking.openURL(`tel:${number}`);
//     };
//
//     useEffect(() => {
//         if (!contentWidth) return;
//
//         translateX.setValue(0);
//
//         Animated.loop(
//             Animated.timing(translateX, {
//                 toValue: -contentWidth,
//                 duration: contentWidth * 25,
//                 easing: Easing.linear,
//                 useNativeDriver: true,
//             })
//         ).start();
//     }, [contentWidth]);
//
//     return (
//         <View style={styles.container}>
//             {/* CONTENT WRAPPER — THIS WAS MISSING */}
//             <View
//                 style={[
//                     styles.content,
//                     { paddingBottom: insets.bottom }, // safe area applied here
//                 ]}
//             >
//                 <MaterialCommunityIcons
//                     name="alert-circle"
//                     size={18}
//                     color="#FFFFFF"
//                 />
//
//                 <View style={styles.marqueeWrapper}>
//                     <Animated.View
//                         style={{
//                             flexDirection: 'row',
//                             transform: [{ translateX }],
//                         }}
//                     >
//                         {/* Measured copy */}
//                         <View
//                             onLayout={(e) =>
//                                 setContentWidth(e.nativeEvent.layout.width)
//                             }
//                         >
//                             <MarqueeContent callNumber={callNumber} />
//                         </View>
//
//                         {/* Duplicate copy */}
//                         <MarqueeContent callNumber={callNumber} />
//                     </Animated.View>
//                 </View>
//             </View>
//         </View>
//     );
// }
//
// function MarqueeContent({
//                             callNumber,
//                         }: {
//     callNumber: (n: string) => void;
// }) {
//     return (
//         <View style={styles.marqueeRow}>
//             <Pressable onPress={() => callNumber('108')}>
//                 <Text style={styles.text}>
//                     <Text style={styles.bold}>108</Text> Ambulance
//                 </Text>
//             </Pressable>
//
//             <Text style={styles.separator}> • </Text>
//
//             <Pressable onPress={() => callNumber('104')}>
//                 <Text style={styles.text}>
//                     <Text style={styles.bold}>104</Text> Health Helpline
//                 </Text>
//             </Pressable>
//
//             <Text style={styles.separator}> • </Text>
//
//             <Pressable onPress={() => callNumber('102')}>
//                 <Text style={styles.text}>
//                     <Text style={styles.bold}>102</Text> Medical Emergency
//                 </Text>
//             </Pressable>
//
//             <Text style={styles.separator}> • </Text>
//         </View>
//     );
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: '#DC2626',
//         zIndex: 100,
//     },
//
//     content: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',     // 👈 vertical centering
//         paddingHorizontal: 12,
//         paddingVertical: 12,
//     },
//
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//         overflow: 'hidden',
//     },
//
//     marqueeWrapper: {
//         flex: 1,
//         overflow: 'hidden',
//         marginLeft: 8,
//     },
//
//     marqueeRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//
//     text: {
//         color: '#FFFFFF',
//         fontSize: 15,
//     },
//
//     bold: {
//         fontWeight: '800',
//     },
//
//     separator: {
//         color: '#FFFFFF',
//         marginHorizontal: 12,
//     },
// });
