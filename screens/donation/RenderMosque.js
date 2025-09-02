import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Animated 
} from "react-native";
import res from "../../constants/res";
import { useNavigation } from "@react-navigation/native";

const RenderMosque = ({ item, orgId }) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);
  const imageOpacity = useState(new Animated.Value(0))[0];

  const onImageLoadEnd = () => {
    setImageLoading(false);
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.mosqueItem}>
      {/* Image Container */}
      <View style={styles.imageWrapper}>
        {imageLoading && (
          <ActivityIndicator 
            size="small" 
            color="#888" 
            style={styles.loader} 
          />
        )}

        <Animated.Image
          source={{ uri: item?.imageURL }}
          style={[styles.mosqueImage, { opacity: imageOpacity, position: "absolute" }]}
          onLoadEnd={onImageLoadEnd}
        />
      </View>

      <Text style={styles.mosqueTitle} numberOfLines={1}>
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Select_donation_Amount', {
            siteId: item.id,
            orgId: orgId,
            donationType: 1,
            item: item,
            type: 2,
          });
        }}
        style={styles.donateButton}
      >
        <Text style={styles.donateButtonText}>{res.strings.donate}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderMosque;

const styles = StyleSheet.create({
  mosqueItem: {
    width: 161,
    marginRight: 16,
  },
  imageWrapper: {
    width: "100%",
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f5f5f5", // placeholder background
    overflow: "hidden",
    position: "relative",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  mosqueImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  mosqueTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#181B1F",
    marginHorizontal: 4,
    marginTop: 8,
  },
  donateButton: {
    backgroundColor: "#9F9AF433",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  donateButtonText: {
    color: "#272682",
    fontWeight: "600",
    fontSize: 14,
  },
});
