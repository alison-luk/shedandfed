import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import ReptileAvatar from '@/components/ReptileAvatar';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ProfilePhotoPickerProps {
  name: string;
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
}

export default function ProfilePhotoPicker({ name, imageUri, onImageChange }: ProfilePhotoPickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange(result.assets[0].uri);
    }
  }

  function removeImage() {
    Alert.alert('Remove photo?', 'The reptile will use an initial instead.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onImageChange(null) },
    ]);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Profile photo</Text>
      <View style={styles.row}>
        <Pressable onPress={pickImage} accessibilityRole="button" accessibilityLabel="Choose profile photo">
          <ReptileAvatar
            reptile={{ name: name || '?', imageUri }}
            size={88}
            style={{ borderWidth: 3, borderColor: colors.card }}
          />
          <View style={[styles.cameraBadge, { backgroundColor: colors.tint }]}>
            <MaterialIcons name="photo-camera" size={16} color="#fff" />
          </View>
        </Pressable>
        <View style={styles.actions}>
          <Pressable onPress={pickImage} style={[styles.button, { borderColor: colors.border }]}>
            <Text style={{ color: colors.tint, fontWeight: '600' }}>
              {imageUri ? 'Change photo' : 'Add photo'}
            </Text>
          </Pressable>
          {imageUri ? (
            <Pressable onPress={removeImage}>
              <Text style={{ color: colors.danger, fontWeight: '600' }}>Remove</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actions: {
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});
