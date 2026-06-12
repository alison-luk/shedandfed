import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LogTypeIcon from '@/components/LogTypeIcon';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { LOG_TYPE_LABELS, TEMPERATURE_UNIT, type LogType, type WeightUnit } from '@/lib/types';

const LOG_TYPES: LogType[] = ['feeding', 'shedding', 'temperature', 'weight', 'poop', 'note'];

const SHED_OPTIONS = ['Complete', 'Partial', 'Stuck shed', 'Blue phase'];

const POOP_OPTIONS = ['Normal', 'Runny', 'Hard', 'Unusual', 'None'];

const WEIGHT_UNITS: WeightUnit[] = ['g', 'kg', 'oz', 'lb'];

function parseLogType(value: string | string[] | undefined): LogType {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && LOG_TYPES.includes(raw as LogType)) {
    return raw as LogType;
  }
  return 'feeding';
}

function buildLogPayload(
  reptileId: string,
  type: LogType,
  date: Date,
  fields: {
    notes: string;
    food: string;
    amount: string;
    shedQuality: string;
    poopQuality: string;
    hotSide: string;
    coolSide: string;
    ambient: string;
    weight: string;
    weightUnit: WeightUnit;
  }
) {
  return {
    reptileId,
    type,
    date: date.toISOString(),
    notes: fields.notes || undefined,
    food: type === 'feeding' ? fields.food : undefined,
    amount: type === 'feeding' ? fields.amount : undefined,
    shedQuality: type === 'shedding' ? fields.shedQuality : undefined,
    poopQuality: type === 'poop' ? fields.poopQuality : undefined,
    hotSide: type === 'temperature' && fields.hotSide ? parseFloat(fields.hotSide) : undefined,
    coolSide: type === 'temperature' && fields.coolSide ? parseFloat(fields.coolSide) : undefined,
    ambient: type === 'temperature' && fields.ambient ? parseFloat(fields.ambient) : undefined,
    weight: type === 'weight' && fields.weight ? parseFloat(fields.weight) : undefined,
    weightUnit: type === 'weight' ? fields.weightUnit : undefined,
  };
}

export default function AddLogScreen() {
  const { id, type: typeParam, logId } = useLocalSearchParams<{
    id: string;
    type?: string;
    logId?: string;
  }>();
  const isEditing = Boolean(logId);
  const initialType = parseLogType(typeParam);
  const { addLog, editLog } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [loadingEntry, setLoadingEntry] = useState(isEditing);
  const [type, setType] = useState<LogType>(initialType);
  const typeLocked = Boolean(typeParam) && !isEditing;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [food, setFood] = useState('');
  const [amount, setAmount] = useState('');
  const [shedQuality, setShedQuality] = useState('Complete');
  const [poopQuality, setPoopQuality] = useState('Normal');
  const [hotSide, setHotSide] = useState('');
  const [coolSide, setCoolSide] = useState('');
  const [ambient, setAmbient] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('g');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (logId || !id || initialType !== 'feeding') return;

    (async () => {
      const { getLastFeeding } = await import('@/lib/db');
      const lastFeeding = await getLastFeeding(id);
      if (!lastFeeding) return;

      setFood(lastFeeding.food ?? '');
      setAmount(lastFeeding.amount ?? '');
    })();
  }, [id, initialType, logId]);

  useEffect(() => {
    if (!logId) return;

    (async () => {
      const { getLog } = await import('@/lib/db');
      const entry = await getLog(logId);
      if (!entry) {
        Alert.alert('Error', 'Log entry not found.');
        router.back();
        return;
      }

      setType(entry.type);
      setDate(new Date(entry.date));
      setNotes(entry.notes ?? '');
      setFood(entry.food ?? '');
      setAmount(entry.amount ?? '');
      setShedQuality(entry.shedQuality ?? 'Complete');
      setPoopQuality(entry.poopQuality ?? 'Normal');
      setHotSide(entry.hotSide != null ? String(entry.hotSide) : '');
      setCoolSide(entry.coolSide != null ? String(entry.coolSide) : '');
      setAmbient(entry.ambient != null ? String(entry.ambient) : '');
      setWeight(entry.weight != null ? String(entry.weight) : '');
      setWeightUnit(entry.weightUnit ?? 'g');
      setLoadingEntry(false);
    })();
  }, [logId]);

  async function handleSave() {
    if (!id) return;

    const payload = buildLogPayload(id, type, date, {
      notes,
      food,
      amount,
      shedQuality,
      poopQuality,
      hotSide,
      coolSide,
      ambient,
      weight,
      weightUnit,
    });

    setSaving(true);
    try {
      if (isEditing && logId) {
        await editLog({ id: logId, ...payload });
      } else {
        await addLog(payload);
      }
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save log entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loadingEntry) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: isEditing ? 'Edit Entry' : LOG_TYPE_LABELS[type],
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
        {!typeLocked ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Entry Type</Text>
            <View style={styles.typeGrid}>
              {LOG_TYPES.map((logType) => {
                const selected = type === logType;
                return (
                  <Pressable
                    key={logType}
                    onPress={() => setType(logType)}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor: selected ? colors.tint : colors.card,
                        borderColor: selected ? colors.tint : colors.border,
                      },
                    ]}>
                    <LogTypeIcon
                      type={logType}
                      size={18}
                      color={selected ? '#fff' : colors.tint}
                    />
                    <Text style={[styles.typeChipText, { color: selected ? '#fff' : colors.text }]}>
                      {LOG_TYPE_LABELS[logType]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <View style={[styles.typeBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <LogTypeIcon type={type} size={22} color={colors.tint} />
            <Text style={styles.typeBannerText}>{LOG_TYPE_LABELS[type]}</Text>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Date & Time</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialIcons name="event" size={22} color={colors.tint} />
          <Text style={styles.dateText}>
            {date.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </Pressable>

        {showDatePicker ? (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selected) setDate(selected);
            }}
          />
        ) : null}

        {type === 'feeding' ? (
          <>
            <FormField label="Food" value={food} onChangeText={setFood} placeholder="e.g. Frozen mouse" />
            <FormField label="Amount" value={amount} onChangeText={setAmount} placeholder="e.g. 1 medium" />
          </>
        ) : null}

        {type === 'shedding' ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Shed Quality</Text>
            <View style={styles.optionRow}>
              {SHED_OPTIONS.map((option) => {
                const selected = shedQuality === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setShedQuality(option)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: selected ? colors.tint : colors.card,
                        borderColor: selected ? colors.tint : colors.border,
                      },
                    ]}>
                    <Text style={{ color: selected ? '#fff' : colors.text, fontSize: 13 }}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {type === 'poop' ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Poop Quality</Text>
            <View style={styles.optionRow}>
              {POOP_OPTIONS.map((option) => {
                const selected = poopQuality === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setPoopQuality(option)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: selected ? colors.tint : colors.card,
                        borderColor: selected ? colors.tint : colors.border,
                      },
                    ]}>
                    <Text style={{ color: selected ? '#fff' : colors.text, fontSize: 13 }}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {type === 'temperature' ? (
          <>
            <FormField
              label={`Hot Side (${TEMPERATURE_UNIT})`}
              value={hotSide}
              onChangeText={setHotSide}
              placeholder="e.g. 32"
              keyboardType="decimal-pad"
            />
            <FormField
              label={`Cool Side (${TEMPERATURE_UNIT})`}
              value={coolSide}
              onChangeText={setCoolSide}
              placeholder="e.g. 24"
              keyboardType="decimal-pad"
            />
            <FormField
              label={`Ambient (${TEMPERATURE_UNIT})`}
              value={ambient}
              onChangeText={setAmbient}
              placeholder="Optional"
              keyboardType="decimal-pad"
            />
          </>
        ) : null}

        {type === 'weight' ? (
          <>
            <FormField
              label="Weight"
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 450"
              keyboardType="decimal-pad"
            />
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Unit</Text>
            <View style={styles.optionRow}>
              {WEIGHT_UNITS.map((unit) => {
                const selected = weightUnit === unit;
                return (
                  <Pressable
                    key={unit}
                    onPress={() => setWeightUnit(unit)}
                    style={[
                      styles.unitChip,
                      {
                        backgroundColor: selected ? colors.tint : colors.card,
                        borderColor: selected ? colors.tint : colors.border,
                      },
                    ]}>
                    <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '600' }}>
                      {unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        <FormField
          label={type === 'note' ? 'Note' : 'Notes (optional)'}
          value={notes}
          onChangeText={setNotes}
          placeholder={type === 'note' ? 'Write your note here...' : 'Additional details...'}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    marginRight: 16,
    paddingVertical: 4,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  typeBannerText: {
    fontSize: 17,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});
