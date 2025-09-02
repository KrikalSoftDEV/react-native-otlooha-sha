import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TouchableWithoutFeedback,
    Alert,
    Modal,
    Animated,
    Easing,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import EditDhikerImg from "../../assets/images/edit-dhiker.png"
import SettingDhikerImg from "../../assets/images/dhiker-setting.png"
import DhikerMenuImg from "../../assets/images/dhikir-menu.png"
import DhikerPlayImg from "../../assets/images/dhikir-play.png"
import BackArrow from "../../assets/images/black-back-arrow.png"
import RefersIcon from "../../assets/images/QiblaCompass/refress-icon.png"
import { useIsFocused, useNavigation } from '@react-navigation/native';
import DhikirGoalModal from '../../components/UI/DhikirGoalModal';
import SelectedDhikrModal from './SelectedDhikrModal';
import { WelcomeButton } from '../../components/UI/Button';
import CurrentDhikirModal from './CurrentDhikirModal';
import DhikirCompletedModal from './DhikirCompletedModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageModal from '../common/LanguageModal';
import strings from '../../constants/Strings';
import { Toast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { changeLanguageApi } from '../../redux/slices/userSlice';
import RosaryPearlsRotator from './RosaryPearlsRotator';
import { getData, storeData } from '../../constants/Storage';
import { NAVIGATIONBAR_HEIGHT, STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TasbihDhikir = ({ route }) => {
    const selectedTarget = route?.params?.selectedTarget || 0;
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(selectedTarget);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCurrentDikerModalVisible, setIsCurrentDikerModalVisible] = useState(false);
    const [seeSelectDhikrmodalVisible, setSeeSelectDhikrModalVisible] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [currentDhikirIndex, setCurrentDhikirIndex] = useState(0)
    const [selectedDhikrItems, setSelectedDhikrItems] = useState([])
    const [applyTargetAllSelectedDhikir, setApplyTargetAllSelectedDhikir] = useState(false)
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
   const [language,setLangauge]=useState(null)

    const dhikrSelectionScreen = route.params?.dhikrSelectionScreen


    useEffect(() => {
        getLanguage()
    }, [isFocused, language])

    const getLanguage = async () => {
        const isLangFlag = await getData("isDhikirLangFlag");
        if (isLangFlag === "en") {
            setLangauge("English")
        }
        else if (isLangFlag === "my") {
            setLangauge("Malay")
        }
    }

    useEffect(() => {
        const loadFromAsyncStorage = async () => {
            try {
                const stored = await AsyncStorage.getItem('@selected_Dhikir_items');
                if (stored) {
                    setSelectedDhikrItems(JSON.parse(stored));
                    if (!target) {
                        setIsModalVisible(true)
                    }
                    setIsCurrentDikerModalVisible(true)
                }
            } catch (e) {
                console.error('Error loading from AsyncStorage:', e);
            }
        };
        if (isFocused) {
            loadFromAsyncStorage()
        }
    }, [isFocused])


    const animateCheckmark = () => {
        Animated.sequence([
            Animated.spring(checkmarkScale, {
                toValue: 1,
                tension: 50,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        if (showCompletionModal) {
            animateCheckmark();
        } else {
            checkmarkScale.setValue(0);
        }
    }, [showCompletionModal]);

    const handleCount = () => {
        if (count < target) {
            setCount(count + 1);
        }
    };

    const beadCountCalculation = () => {
        if (target === 0) {
            setIsModalVisible(true);
        } else if (count === (target - 1)) {
            setCount(count + 1);
            if (currentDhikirIndex < selectedDhikrItems?.length) {
                setCurrentDhikirIndex(currentDhikirIndex + 1)
            } else {
                setCurrentDhikirIndex(0)
            }
            setShowCompletionModal(true)
        } else if (count < target) {
            setCount(count + 1);
        } else {
            setShowCompletionModal(true)
        }
    };

    const deleteDhikirItem = async (id) => {
        try {
            let filteredItem = selectedDhikrItems.filter(item => item.number !== id)
            setSelectedDhikrItems(filteredItem);
            if (filteredItem.length) {
                await AsyncStorage.setItem('@selected_Dhikir_items', JSON.stringify(filteredItem));
            } else {
                AsyncStorage.removeItem('@selected_Dhikir_items')
                setSeeSelectDhikrModalVisible(false)
                setIsCurrentDikerModalVisible(false)
            }
        } catch (error) {
            console.log(error)
        }
    };
    const handleGoBack = () => {
        AsyncStorage.removeItem('@selected_Dhikir_items')
        if (dhikrSelectionScreen) {
            navigation.navigate("TabNavigation")
        } else {
            navigation.goBack()
        }
    };
    const handleLanguageSelect = async (languageData) => {


        setLanguageModalVisible(false);
        const langUpdate = languageData === "English" ? "en" : "my";
        await storeData('isDhikirLangFlag', langUpdate);
        if (languageData === "English") {
            setLangauge("English")
        }
        else if (languageData === "Malay") {
            setLangauge("Malay")
        }

    };


    const handleRefresh = () => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
        AsyncStorage.removeItem('@selected_Dhikir_items');
        // setSelectedDhikrItems([]);
        // setApplyTargetAllSelectedDhikir(false)
        // setIsCurrentDikerModalVisible(false);
        // setCurrentDhikirIndex(0);

        if (count) {
            // setTarget(0);
            setCount(0)
            Toast.show('Counter reset successfully.', {
                type: 'success',
                placement: 'bottom',
            });

        }

    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg'],
    });

    const refreshIcon = (
        <Animated.Image
            source={RefersIcon}
            style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                transform: [{ rotate: spin }],
            }}
        />
    );
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}
                style={styles.headerButton}
            >
                <Image source={BackArrow} style={styles.headerIcon} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Tasbih and Dhikir</Text>
                <Text style={styles.headerSubTitle}>Tap anywhere to begin</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleRefresh}
                >
                    {refreshIcon}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.headerButton, { marginLeft: 10 }]}
                    onPress={() => setLanguageModalVisible(true)}
                >
                    <Image source={SettingDhikerImg} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCounterContainer = () => (
        <View style={styles.counterContainer}>
            <Text style={styles.counterMain}>{String(count).padStart(2, '0')}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.counterSub}>/{String(target).padStart(2, '0')}</Text>
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(true)
                }}>
                    <Image source={EditDhikerImg} style={styles.editIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTasbihContainer = () => (
        <View style={styles.tasbihContainer}>
            <RosaryPearlsRotator beadCountCalculation={beadCountCalculation} />
        </View>
    );
    const renderFooterContainer = () => {
     
        return (
            <View style={[styles.buttonContainer,]}>
                <WelcomeButton
                    tittle={"Select Dhikir"}
                    style={[{ marginTop: scale(24) }]}
                    onPress={() => navigation.navigate('DhikrSelectionScreen', {
                        title: 'Select Dhikir',
                        target: target,
                        onGoBack: (data) => {
                            console.log('Returned data:', data);
                        },
                    })}
                />
            </View>
        )
    }

    const listPlayButtonContainer = () => (
        <>
            {selectedDhikrItems?.length > 0 ? (
                <View style={styles.tasbihControlButtonsContainer}>
                    <TouchableOpacity style={[styles.tasbihControlButton]}
                        onPress={() => setSeeSelectDhikrModalVisible(true)}>
                        <Image source={DhikerMenuImg} style={styles.ControlButtonIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tasbihControlButton}
                        onPress={() => {}}>
                        <Image source={DhikerPlayImg} style={styles.ControlButtonIcon} />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                    <Text style={{ color: '#686E7A', fontSize: scale(12), fontWeight: "500" }}>Current Dhikir</Text>
                    <Text style={{ color: '#181B1F', fontSize: scale(18), fontWeight: "600" }}>No Dhikir Selected</Text>
                </View>
            )
            }
        </>

    );

    return (
        <LinearGradient
            colors={['#E4E2FD', '#FFFFFF', '#E4E2FD']}
            style={styles.gradient}
        >
            <SafeAreaView style={[styles.root]}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
                <View style={{flex:1,justifyContent:'space-between'}}>
                    <View >
                {renderHeader()}

                {renderCounterContainer()}
                {renderTasbihContainer()}
                {listPlayButtonContainer()}
                </View>
                <View style={{paddingBottom: insets?.bottom+30}}>
                {renderFooterContainer()}
                </View>
                </View>
                {isModalVisible && <DhikirGoalModal
                    target={target}
                    setTarget={setTarget}
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    selectedDhikrItems={selectedDhikrItems}
                    applyTargetAllSelectedDhikir={applyTargetAllSelectedDhikir}
                    setApplyTargetAllSelectedDhikir={setApplyTargetAllSelectedDhikir}
                />}
                {seeSelectDhikrmodalVisible &&
                    <SelectedDhikrModal
                        modalVisible={seeSelectDhikrmodalVisible}
                        renderData={selectedDhikrItems?.length ? selectedDhikrItems : []}
                        onClose={() => setSeeSelectDhikrModalVisible(false)}
                        deleteDhikirItem={deleteDhikirItem}
                    />
                }
                <DhikirCompletedModal
                    isVisible={showCompletionModal}
                    onClose={() => setShowCompletionModal(false)}
                    currentDhikirIndex={currentDhikirIndex}
                    totalDhikir={selectedDhikrItems?.length}
                    setTarget={setTarget}
                    setCurrentDhikirIndex={setCurrentDhikirIndex}
                    setCount={setCount}
                />

                {isCurrentDikerModalVisible && <CurrentDhikirModal
                    isVisible={isCurrentDikerModalVisible}
                    onClose={() => setIsCurrentDikerModalVisible(false)}
                    renderData={selectedDhikrItems[currentDhikirIndex] || {}}
                />}
                  <LanguageModal
          visible={languageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          onSelect={handleLanguageSelect}
          langSelect={language}
        />
            </SafeAreaView>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({

    root: {
        flex: 1,
        alignItems: 'center',
        paddingTop: verticalScale(STATUSBAR_HEIGHT),


    },
    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header: {
    //  borderWidth:1,
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        height: scale(20),
        width: scale(20),
        resizeMode: "contain"
    },
    editIcon: {
        height: scale(20),
        width: scale(20),
        resizeMode: "contain"
    },
    headerTitleContainer: {
        paddingTop:9,
        marginRight: -25,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    headerTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#181B1F',
    },
    headerSubTitle: {
        fontSize: scale(12),
        color: '#686E7A',
        textAlign: 'center',
        marginTop: 2,
    },
    counterContainer: {
        alignItems: 'center',
        marginTop: scale(10),
        marginBottom: scale(10),
        position: 'relative',
    },
    counterMain: {
        fontSize: scale(56),
        fontWeight: '700',
        color: '#191967',
    },
    counterSub: {
        fontSize: scale(20),
        color: '#191967',
        fontWeight: '700',
        marginRight: scale(5)
    },

    tasbihContainer: {
        alignSelf: "center",
        alignItems: 'center',
        marginTop: scale(10),
        height: verticalScale(300),
        width: '100%'
    },
    tasbihControlButtonsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: 'center',
        marginTop: scale(10),
    },
    tasbihControlButton: {
        alignItems: 'center',
        // marginHorizontal:10,
        height: 50,
        width: 50
    },
    ControlButtonIcon: {
        height: scale(30),
        width: scale(30),
        resizeMode: "contain"
    },
    buttonContainer: {
        // backgroundColor:'red',
        width: '100%',
        alignItems: 'center',
    },

    backButtonText: {
        fontSize: scale(24),
        fontWeight: 'bold',
        color: '#000',
    },
});
export default TasbihDhikir