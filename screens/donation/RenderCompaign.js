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

const RenderCompaign = ({ item, orgId }) => {
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
    <View style={styles.mosqueItem1}>
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
          source={{ uri: item?.images?.[0] }}
          style={[styles.mosqueImage1, { opacity: imageOpacity, position: "absolute" }]}
          onLoadEnd={onImageLoadEnd}
        />
      </View>

      <Text style={styles.mosqueTitle1} numberOfLines={1}>
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Campaign_Details', {
            appealId: item.id,
            orgId: orgId,
            item: item,
            donationType: 1,
            siteId: item.id,
            type: 1,
          });
        }}
        style={styles.donateButton1}
      >
        <Text style={styles.donateButtonText1}>{res.strings.donate}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderCompaign;

const styles = StyleSheet.create({
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
  mosqueImage1: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  mosqueTitle1: {
    fontSize: 14,
    fontWeight: "600",
    color: "#181B1F",
    marginHorizontal: 4,
    marginTop: 8,
  },
  donateButton1: {
    backgroundColor: "#9F9AF433",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  donateButtonText1: {
    color: "#272682",
    fontWeight: "600",
    fontSize: 14,
  },
  mosqueItem1: {
    width: 161,
    marginRight: 16,
  },
});
