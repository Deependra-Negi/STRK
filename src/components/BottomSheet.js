import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomSheet({ visible, onClose, theme, children }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const parent = navigation.getParent?.();
    if (!parent) {
      return;
    }
    parent.setOptions({ tabBarStyle: { display: visible ? "none" : "flex" } });
  }, [navigation, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableOpacity style={[StyleSheet.absoluteFillObject, s.overlay]} activeOpacity={1} onPress={onClose}>
        <View style={[s.sheetContainer, { bottom: -insets.bottom }]} pointerEvents="box-none">
          <TouchableOpacity activeOpacity={1}>
            <ScrollView
              style={[s.sheet, { backgroundColor: theme.card }]}
              contentContainerStyle={{ padding: 24, paddingBottom: 40 + insets.bottom }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheetContainer: { position: "absolute", left: 0, right: 0, bottom: 0 },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    width: "100%",
    alignSelf: "stretch"
  },
});
