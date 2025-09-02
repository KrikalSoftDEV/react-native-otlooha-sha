import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
// import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const EventsDetails_2 = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  // Sample images for the carousel
  const carouselImages = [
    {
      id: 1,
      uri: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      uri: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      uri: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 5,
      uri: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.carouselSlide}>
        <Image source={{ uri: item.uri }} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header with image carousel */}
      <View style={styles.imageContainer}>
        <Carousel
          ref={carouselRef}
          data={carouselImages}
          renderItem={renderCarouselItem}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) => setActiveSlide(index)}
          autoplay={true}
          autoplayDelay={3000}
          autoplayInterval={4000}
          loop={true}
          enableMomentum={false}
          lockScrollWhileSnapping={true}
        />
        
        {/* Overlay gradient for better text readability */}
        <View style={styles.overlayGradient} />
        
        {/* Back button */}
        <TouchableOpacity style={styles.backButton}>
          {/* <Ionicons name="chevron-back" size={24} color="white" /> */}
        </TouchableOpacity>
        
        {/* Status bar overlay */}
        <View style={styles.statusBarOverlay}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <View style={styles.signalBars}>
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
              <View style={[styles.bar, styles.bar4]} />
            </View>
            {/* <Ionicons name="wifi" size={16} color="white" /> */}
            <View style={styles.battery}>
              <View style={styles.batteryFill} />
            </View>
          </View>
        </View>
        
        {/* Custom Pagination */}
        <View style={styles.paginationContainer}>
          {/* <Pagination
            dotsLength={carouselImages.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationWrapper}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.paginationInactiveDot}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.8}
            animatedDuration={150}
            animatedFriction={4}
          /> */}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Elderly Care Program of Nur Ehsan</Text>
        
        {/* Event type badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Offline Event</Text>
          </View>
        </View>
        
        {/* Event details */}
        <View style={styles.detailsContainer}>
          {/* Date section */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              {/* <MaterialIcons name="calendar-today" size={24} color="#6366F1" /> */}
            </View>
            <View style={styles.detailContent}>
              <View style={styles.dateRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <Text style={styles.dateValue}>Sat 28 Jun, 2025</Text>
                </View>
                <View style={styles.dateColumn}>
                  <Text style={styles.dateLabel}>End Date</Text>
                  <Text style={styles.dateValue}>Tue 15 Jul, 2025</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Location section */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              {/* <MaterialIcons name="location-on" size={24} color="#6366F1" /> */}
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.locationLabel}>Location</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationValue}>
                  Garden Hotel 29 Jalan Jenang, Batu Pahat, Johor 83000
                </Text>
                {/* <MaterialIcons name="open-in-new" size={16} color="#6366F1" /> */}
              </View>
            </View>
          </View>
        </View>
        
        {/* About section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Event</Text>
          <Text style={styles.aboutText}>
            The Nur Ehsan Elderly Care Program offers free, holistic support to seniors through day-care clubs, home visits, and digital literacy training. It aims to empower the elderly, promote active aging, and enhance their quality of life while building stronger community connections.
          </Text>
        </View>
      </ScrollView>
      
      {/* Participate button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.participateButton}>
          <Text style={styles.participateText}>Participate</Text>
        </TouchableOpacity>
      </View>
      
      {/* Home indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  carouselSlide: {
    width: width,
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  statusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    position: 'relative',
  },
  batteryFill: {
    width: '90%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  paginationWrapper: {
    paddingVertical: 20,
  },
  paginationDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  paginationInactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 36,
    marginBottom: 16,
  },
  badgeContainer: {
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginRight: 8,
  },
  aboutSection: {
    marginBottom: 100,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  participateButton: {
    backgroundColor: '#6366F1',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default EventsDetails_2;