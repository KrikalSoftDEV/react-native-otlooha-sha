import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

const CardScanner = ({ onResult, onClose }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const camera = useRef(null);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);

    const devices = useCameraDevices();
    const device = devices.back;

    if (!hasPermission || !device) {
        return <Text>Loading Camera...</Text>;
    }


    const scanCard = async () => {
        if (camera.current) {
            const photo = await camera.current.takePhoto({
                flash: 'off',
            });

            const result = await TextRecognition.recognize(photo.path);
            const textBlocks = result.blocks.map((b) => b.text);

            const cardNumber = textBlocks.find((t) => t.replace(/\s/g, '').length >= 16);
            const expiry = textBlocks.find((t) => /(\d{2}\/\d{2})/.test(t));

            onResult({
                cardNumber: cardNumber || '',
                expiryDate: expiry || '',
            });
        }
    };

    if (!device) return <Text>Loading Camera...</Text>;

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                ref={camera}
            />
            <TouchableOpacity style={styles.button} onPress={scanCard}>
                <Text style={styles.text}>📸 Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.close}>
                <Text style={styles.text}>✖ Close</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        padding: 16,
        backgroundColor: '#2454FF',
        borderRadius: 10,
    },
    close: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CardScanner;
