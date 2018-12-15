import React from 'react';
import Expo from 'expo';
import { Provider } from 'react-redux';

import cacheAssetsAsync from './shared/helpers/cacheAssetsAsync';

import initializeCore from './core';

const { MainNavigator, store } = initializeCore();


export default class App extends React.PureComponent {
  state = {
    appIsReady: false,
  };

  public componentWillMount() {
    this._loadAssetsAsync();
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <MainNavigator />
        </Provider>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }

  private async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        fonts: [
          {
            'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
          },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.',
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }
}
