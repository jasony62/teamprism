module.exports = {
  presets: [
    ['@vue/app'],
    [
      '@vue/babel-preset-jsx',
      {
        injectH: false
      }
    ]
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ],
    [
      'import',
      {
        libraryName: 'tms-vue-ui',
        style: true
      }
    ]
  ]
}
