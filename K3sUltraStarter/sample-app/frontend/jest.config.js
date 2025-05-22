module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^react-router-dom$': require.resolve('react-router-dom'),
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
