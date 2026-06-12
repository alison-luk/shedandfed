import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Default React Navigation bottom tab bar content height. */
const TAB_BAR_HEIGHT = 49;

export function useBottomTabOffset(extra = 12): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom + extra;
}
