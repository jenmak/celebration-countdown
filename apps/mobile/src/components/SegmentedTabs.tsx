import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, type } from '../theme/tokens'

export type TabKey = string

type Props<T extends TabKey> = {
  tabs: ReadonlyArray<{ key: T; label: string }>
  value: T
  onChange: (key: T) => void
}

/** Tab strip that sits flush against the top edge of the auth card. */
export function SegmentedTabs<T extends TabKey>({
  tabs,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const active = tab.key === value
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
  },
  tabActive: {
    backgroundColor: colors.tabActive,
    borderBottomColor: colors.accent,
  },
  tabInactive: {
    backgroundColor: colors.tabInactive,
    borderBottomColor: colors.tabInactive,
  },
  label: {
    ...type.tab,
    color: colors.inkSoft,
  },
  labelActive: {
    color: colors.accent,
  },
})
