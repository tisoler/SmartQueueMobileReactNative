import React from 'react';
import { StyleSheet, View } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hayError: false };

  componentDidCatch(error, errorInfo) {
    this.setState({ hayError: true })
  }

  render() {
    if (this.state.hayError) {
      return (
        <View style={styles.container}>
          <Text style={styles.textoBlanco}>Algo ha fallado</Text>
          {this.props.errorMessage && <Text>{this.props.errorMessage}</Text>}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoBlanco: {
      color: '#fff',
      fontSize: 60
  }
});

export default ErrorBoundary;