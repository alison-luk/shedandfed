import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Custom tab bar block height plus padding (safe area added separately). */
const TAB_BAR_HEIGHT = 96;

export function useBottomTabOffset(extra = 12): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom + extra;
}
