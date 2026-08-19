import { StyleSheet, View } from 'react-native'
import { colors } from '../theme/tokens'

const TICKS = 12

/**
 * Brand medallion: a cream disc with radiating ticks around a birthday cake.
 * Drawn with views so the app ships without image assets.
 */
export function CakeMark({ size = 76 }: { size?: number }) {
  const radius = size / 2

  return (
    <View style={[styles.disc, { width: size, height: size, borderRadius: radius }]}>
      {Array.from({ length: TICKS }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.tickWrap,
            {
              width: size,
              height: size,
              transform: [{ rotate: `${(360 / TICKS) * i}deg` }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.tick} />
        </View>
      ))}

      <View style={styles.cake}>
        <View style={styles.candles}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.candleWrap}>
              <View style={styles.flame} />
              <View style={styles.candle} />
            </View>
          ))}
        </View>
        <View style={styles.frosting} />
        <View style={styles.base} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: colors.medallion,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  tick: {
    width: 2,
    height: 6,
    marginTop: 5,
    borderRadius: 1,
    backgroundColor: colors.lineStrong,
  },
  cake: {
    alignItems: 'center',
  },
  candles: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 2,
  },
  candleWrap: {
    alignItems: 'center',
  },
  flame: {
    width: 3,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginBottom: 1,
  },
  candle: {
    width: 2,
    height: 7,
    borderRadius: 1,
    backgroundColor: colors.ink,
  },
  frosting: {
    width: 30,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.ink,
  },
  base: {
    width: 34,
    height: 12,
    marginTop: 2,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
})
