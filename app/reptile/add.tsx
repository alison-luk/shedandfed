import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import FormField from '@/components/FormField';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';

export default function AddReptileScreen() {
  const { addReptile } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your reptile.');
      return;
    }
    if (!species.trim()) {
      Alert.alert('Species required', 'Please enter the species (e.g. Ball Python, Bearded Dragon).');
      return;
    }

    setSaving(true);
    try {
      const reptile = await addReptile({ name, species, notes });
      router.replace(`/reptile/${reptile.id}`);
    } catch {
      Alert.alert('Error', 'Could not save reptile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleSave} disabled={saving} style={styles.saveButton}>
              <Text style={[styles.saveText, { color: colors.tint, opacity: saving ? 0.5 : 1 }]}>
                Save
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Rex"
        />
        <FormField
          label="Species"
          value={species}
          onChangeText={setSpecies}
          placeholder="e.g. Ball Python"
        />
        <FormField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Morph, enclosure setup, vet info..."
          multiline
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  saveButton: {
    marginRight: 16,
    paddingVertical: 4,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
