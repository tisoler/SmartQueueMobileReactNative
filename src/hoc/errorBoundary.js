// @flow
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

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

type Props = {
  errorMessage: string,
  children: React.Element<any>
}

type State = {
  hayError: boolean
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hayError: false };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error: Object, errorInfo: Object) {
    this.setState({ hayError: true });
  }

  render() {
    const { errorMessage, children } = this.props;
    const { hayError } = this.state;
    if (hayError) {
      return (
        <View style={styles.container}>
          <Text style={styles.textoBlanco}>Algo ha fallado</Text>
          {errorMessage && <Text>{errorMessage}</Text>}
        </View>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
