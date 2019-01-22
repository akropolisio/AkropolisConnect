import React, { Component } from 'react';
import { Text, View, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProps, StackActions, NavigationActions } from 'react-navigation';
import { Spinner } from 'native-base';

import { Input, Modal, Button } from 'shared/view/components';
import { ITransaction } from 'shared/models/types';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import TrustWallet, { MessagePayload, TransactionPayload } from 'react-native-trust-sdk';

import { selectors } from '../../redux';
import styles from './styles';

interface IStateProps {
  transaction: ITransaction | null;
  loadingTransaction: ICommunication;
}

interface IState {
  data: string;
  address: string;
  isOpenModal: boolean;
  amount: string;
  message: string;
}

type IProps = IStateProps & NavigationScreenProps;

class SignTransaction extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Enter a data',
  };

  public callbackScheme: string = 'akropolisconnect://';
  public wallet: TrustWallet = new TrustWallet(this.callbackScheme);

  public state: IState = {
    // address: '0xE47494379c1d48ee73454C251A6395FDd4F9eb43',
    // data: '0x8f834227000000000000000000000000000000005224',
    address: '',
    amount: '1',
    message: 'hello trust',
    data: '',
    isOpenModal: false,
  };

  public componentDidMount() {
    const { transaction } = this.props;
    if (transaction) {
      this.setState({ address: transaction.address, data: transaction.data });
    }
  }

  public componentWillUnmount() {
    this.wallet.cleanup();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { loadingTransaction, transaction } = this.props;
    if (prevProps.loadingTransaction.isRequesting && !loadingTransaction.isRequesting && transaction) {
      this.setState({ address: transaction.address, data: transaction.data });
    }
  }

  public render() {
    const { loadingTransaction } = this.props;

    if (loadingTransaction.isRequesting) {
      return <Spinner color="black" />;
    }

    if (loadingTransaction.error) {
      return <Text style={styles.error}>an error occurred while loading the data for the transaction</Text>;
    }

    return (
      <View style={styles.root}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.description}>To complete the transaction enter date and address</Text>
        </View>
        <View style={{ marginBottom: Platform.OS === 'android' ? 40 : 0 }}>
          <Input label={'Enter Data'} value={this.state.data} onChange={this.onChangeData} />
        </View>
        <View style={{ marginBottom: Platform.OS === 'android' ? 50 : 0 }}>
          <Input label={'Enter Address'} value={this.state.address} onChange={this.onChangeAddress} last />
        </View>
        <View style={styles.signTransaction}>
          <Button
            onPress={this.openModal}
            text="COMPLETE TRANSACTION"
          />
        </View>
        <View style={styles.signTransaction}>
          <Button
            onPress={this.signMsg}
            text="test signMassage"
          />
        </View>
        <View style={styles.signTransaction}>
          <Button
            onPress={this.signTx}
            text="test singTransaction"
          />
        </View>
        {this.renderModal({ success: false })}
      </View >
    );
  }

  public signTx = () => {
    const payload = new TransactionPayload(this.state.address, this.state.amount, this.state.data);
    this.wallet.signTransaction(payload)
      .then((result) => {
        Alert.alert('Transaction Signed', result);
      })
      .catch((error) => {
        Alert.alert('Error', error.msg);
      });
  }

  public signMsg = () => {
    const payload = new MessagePayload(this.state.message);
    this.wallet.signMessage(payload)
      .then((result) => {
        Alert.alert('Message Signed', result);
      }).catch((error) => {
        Alert.alert('Error', error.msg);
      });
  }

  public onChangeData = (value: string) => this.setState({ data: value });
  public onChangeAddress = (value: string) => this.setState({ address: value });

  public renderModal = ({ success }: { success: boolean }) => {

    if (success) {
      return (
        <Modal
          isOpen={this.state.isOpenModal}
          success={success}
          descriptions="Your transaction is sucsesfull go to desktop app"
          acceptText="OK, THANKS"
          onAcceptClick={this.closeModal}
        />
      );
    } else {
      return (
        <Modal
          isOpen={this.state.isOpenModal}
          success={success}
          descriptions="Something goes wrong. Please try agian"
          acceptText="TRY AGAIN"
          onAcceptClick={this.redirectToCamera}
          rejectText="DECIDE LATER"
          onRejectClick={this.redirectToStartPage}
        />
      );
    }
  }

  public closeModal = () => {
    this.setState({ isOpenModal: false });
  }

  public openModal = () => {
    this.setState({ isOpenModal: true });
  }

  public redirectToCamera = () => {
    this.closeModal();

    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'ScannerPreview' }),
        NavigationActions.navigate({ routeName: 'ScannerCamera' }),
      ],
    });
    setTimeout(() => this.props.navigation.dispatch(resetAction), 350); // for smooth animation after closing modal
  }

  public redirectToStartPage = () => {
    this.closeModal();

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'ScannerPreview' }),
      ],
    });
    setTimeout(() => this.props.navigation.dispatch(resetAction), 350); // for smooth animation after closing modal
  }
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    loadingTransaction: selectors.selectCommunication(state, 'loadingTransaction'),
    transaction: selectors.selectTransaction(state),
  };
}

export default connect(mapState)(SignTransaction);
