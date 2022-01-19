export interface SettingManagerState {
  'notifications:desktop': boolean
  'notifications:sounds': any // SoundOptions

  'appearance:emoji': any // EmojiPack
  'appearance:ligatures': boolean
  'appearance:seasonal': boolean
  'appearance:transparency': boolean

  'appearance:theme:base': 'dark' | 'light'
  'appearance:theme:overrides': any // Partial<Overrides>
  'appearance:theme:light': boolean
  'appearance:theme:font': any // Fonts
  'appearance:theme:monoFont': any // MonospaceFonts
  'appearance:theme:css': string

  'security:trustedOrigins': string[]
}
