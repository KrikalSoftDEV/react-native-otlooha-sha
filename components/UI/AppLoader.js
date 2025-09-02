import {ActivityIndicator, StyleSheet, View} from 'react-native';

function AppLoader(props) {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size={'large'} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    alignSelf: 'center',
    position: 'absolute',
  },
});
export default AppLoader;
