import React from 'react';
import { Item, Label, Input as NBInput, Text, View } from 'native-base';
import { TextInput, Platform } from 'react-native';

import { mainColor } from 'shared/constants';

import styles from './styles';

interface IProps {
  label: string;
  value: string;
  last?: boolean;
  onChange(value: string): void;
}

interface IState {
  focused: boolean;
}

export default class Input extends React.PureComponent<IProps, IState> {
  public state: IState = {
    focused: false,
  };

  public render() {
    return Platform.OS === 'ios' ? this.renderIosInput() : this.renderAndroidInput();
  }

  public renderIosInput = () => {
    const { label, value, onChange, last } = this.props;
    return (
      <View
        style={[styles.iosView, {
          borderTopWidth: last ? 0 : 1,
        }]}
      >
        <Text style={styles.iosLabel}>{label}</Text>
        <TextInput
          style={styles.iosValue}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={onChange}
          value={value}
        />
      </View>
    );
  }

  public renderAndroidInput = () => {
    const { label, value, onChange } = this.props;
    return (
      <Item
        stackedLabel
        style={[
          this.state.focused ? {
            borderBottomColor: mainColor,
            borderBottomWidth: 2,
          } : {},
        ]}
      >
        <Label>{label}</Label>
        <NBInput
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={onChange}
          value={value}
          style={{ height: 8 }}
        />
      </Item>
    );
  }

  public onFocus = () => this.setState({ focused: true });
  public onBlur = () => this.setState({ focused: false });

}
