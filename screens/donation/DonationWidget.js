
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackArrowBlack from '../../assets/images/Common/backarrowblack.svg';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Colors from '../../constants/Colors';
import res from '../../constants/res';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const DonationWidget = ({route}) => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('30.00');
  const [selectedPreset, setSelectedPreset] = useState('30.00');
  const [frequency, setFrequency] = useState('One Time');

  const presetAmounts = ['10.00', '30.00', '50.00'];
  const frequencies = [ "One Time", "Monthly", 'Quarterly', 'Annually'];
  
  const onContinuePress = () => {
    navigation.navigate('PaymentScreen', { amount: parseFloat(amount) });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackArrowBlack width={24} height={24} />
        </TouchableOpacity>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>You are making donation to</Text>
          <Text style={styles.orgName}>Waqaf Johan Parade Brigade</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>RM</Text>
            <Text style={styles.amountInput}>{amount}</Text>
          </View>

          {/* Preset Amounts */}
          <View style={styles.presetContainer}>
            {presetAmounts.map(amt => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.presetButton,
                  selectedPreset === amt && styles.selectedPresetButton,
                ]}
                onPress={() => {
                  setAmount(amt);
                  setSelectedPreset(amt);
                }}>
                <Text
                  style={[
                    styles.presetText,
                    selectedPreset === amt && styles.selectedPresetText,
                  ]}>
                  RM {amt}
                </Text>
                {amt === '30.00' && (
                  <View style={styles.mostDonatedTag}>
                    <Text style={styles.tagText}>Most Donated</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.frequencyLabel}>Choose Donation Frequency</Text>
          <View style={styles.freqRow}>
            {frequencies.map(freq => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.freqButton,
                  frequency === freq && styles.selectedFreqButton,
                ]}
                onPress={() => setFrequency(freq)}>
                <Text
                  style={[
                    styles.freqText,
                    frequency === freq && styles.selectedFreqText,
                  ]}>
                  {freq}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.bottomContainer}>
          <Text style={styles.taxInfo}>
            This donation is eligible for a <Text style={styles.bold}>10%</Text> tax
            deduction
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={onContinuePress}>
            <LinearGradient
              colors={['#191967', '#3937A4', '#5756C8']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    // marginTop: 10,
    // marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '400',
    fontSize: 14,
    marginTop: 10,
  },
  orgName: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 10,
    color: Colors.PrimaryBlack,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  currency: {
    fontSize: 24,
    fontWeight: '400',
    marginRight: 5,
    color: '#666',
  },
  amountInput: {
    color: Colors.PrimaryBlack,
    fontSize: 40,
    fontWeight: '800',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  presetButton: {
    backgroundColor: '#F6F5FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 100,
  },
  selectedPresetButton: {
    backgroundColor: '#E6E4FF',
    borderColor: '#5756C8',
    borderWidth: 1,
  },
  presetText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedPresetText: {
    color: '#191967',
    fontWeight: '600',
  },
  mostDonatedTag: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  freqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freqButton: {
    backgroundColor: '#F6F5FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  selectedFreqButton: {
    backgroundColor: '#E6E4FF',
    borderColor: '#5756C8',
    borderWidth: 1,
  },
  freqText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedFreqText: {
    color: '#191967',
    fontWeight: '600',
  },
  bottomContainer: {
    marginBottom: 30,
  },
  taxInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationWidget;
