import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Axios is no longer needed for fetching, but we keep it in case you want to switch back later.
import axios from 'axios';
import { Accelerometer } from 'expo-sensors';


const theme = {
  background: '#161622',
  card: '#1E1E2D',
  primaryText: '#EAEAFE',
  secondaryText: '#A9A9C2',
  accent: '#F92672',
  accent2: '#66D9EF',
  border: '#2C2C3A',
  buttonText: '#FFFFFF',
  placeholder: '#5C5C7A',
};


const LOCAL_QUOTE_DATA = [
  { anime: 'Naruto', character: 'Jiraiya', quote: 'Knowing what it feels like to be in pain, is exactly why we try to be kind to others.' },
  { anime: 'Fullmetal Alchemist: Brotherhood', character: 'Edward Elric', quote: "A lesson without pain is meaningless. For you cannot gain anything without sacrificing something else in return." },
  { anime: 'Attack on Titan', character: 'Levi Ackerman', quote: 'The only thing we\'re allowed to do is to believe that we won\'t regret the choice we made.' },
  { anime: 'My Hero Academia', character: 'All Might', quote: 'It is fine now. Why? Because I am here!' },
  { anime: 'Hunter x Hunter', character: 'Ging Freecss', quote: 'You should enjoy the little detours to the fullest. Because that\'s where you\'ll find the things more important than what you want.' },
  { anime: 'Code Geass', character: 'Lelouch Lamperouge', quote: 'If the king doesn’t move, then his subjects won’t follow.' },
  { anime: 'Death Note', character: 'L Lawliet', quote: 'By trying too hard, we put ourselves at a greater risk.' },
  { anime: 'One Punch Man', character: 'Saitama', quote: 'I’m just a guy who’s a hero for fun.' },
  { anime: 'Jujutsu Kaisen', character: 'Satoru Gojo', quote: 'Throughout heaven and earth, I alone am the honored one.' },
  { anime: 'Demon Slayer', character: 'Kyojuro Rengoku', quote: 'Set your heart ablaze!' },
  { anime: 'Vinland Saga', character: 'Thors', quote: 'A true warrior doesn\'t need a sword.' },
  { anime: 'Cowboy Bebop', character: 'Spike Spiegel', quote: 'Whatever happens, happens.' },
  { anime: 'Steins;Gate', character: 'Okabe Rintarou', quote: 'No one knows what the future holds. That’s why its potential is infinite.' },
  { anime: 'Haikyuu!!', character: 'Shoyo Hinata', quote: 'The future belongs to those who believe in the beauty of their dreams.' },
];


const QuoteContext = createContext();

const QuoteProvider = ({ children }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const fetchQuotes = useCallback((isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

 
    setTimeout(() => {
      try {
        const quotesWithIds = LOCAL_QUOTE_DATA.map((q, index) => ({ ...q, id: `${Date.now()}-${index}` }));
        setQuotes(quotesWithIds);
      } catch (err) {
        setError('Failed to load local data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, 800);
  }, []);

  const addQuote = async (newQuote) => {
    setQuotes(prev => [{ ...newQuote, id: Date.now().toString() }, ...prev]);
  };

  const updateQuote = async (quoteId, updatedInfo) => {
    setQuotes(prev => prev.map(quote => quote.id === quoteId ? { ...quote, ...updatedInfo } : quote));
  };

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <QuoteContext.Provider 
      value={{ quotes, loading, error, refreshing, fetchQuotes, addQuote, updateQuote }}
    >
      {children}
    </QuoteContext.Provider>
  );
};



const QuoteCard = React.memo(({ quote, onEdit }) => (
  <View style={styles.card}>
    <Image source={{ uri: `https://i.pravatar.cc/150?u=${quote.character}` }} style={styles.image} resizeMode="cover" />
    <View style={styles.cardContent}>
      <Text style={styles.quoteText}>"{quote.quote}"</Text>
      <Text style={styles.title} numberOfLines={1}>- {quote.character}</Text>
      <Text style={styles.animeText}>Anime: {quote.anime}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(quote)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const SensorDataVisualizer = ({ x, y, z }) => {
  const normalizeValue = (value) => Math.min(Math.abs(value), 1);
  return (
    <View style={styles.visualizationContainer}>
      <View style={styles.axisContainer}><Text style={[styles.axisLabel, {color: theme.accent}]}>X</Text><View style={styles.axisTrack}><View style={[styles.axisValue, { width: `${normalizeValue(x) * 100}%`, backgroundColor: theme.accent }]} /></View></View>
      <View style={styles.axisContainer}><Text style={[styles.axisLabel, {color: theme.accent2}]}>Y</Text><View style={styles.axisTrack}><View style={[styles.axisValue, { width: `${normalizeValue(y) * 100}%`, backgroundColor: theme.accent2 }]} /></View></View>
      <View style={styles.axisContainer}><Text style={[styles.axisLabel, {color: '#34C759'}]}>Z</Text><View style={styles.axisTrack}><View style={[styles.axisValue, { width: `${normalizeValue(z) * 100}%`, backgroundColor: '#34C759' }]} /></View></View>
    </View>
  );
};

const SensorScreen = () => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let subscription = null;
    if (isActive) {
      subscription = Accelerometer.addListener(setData);
    }
    return () => subscription?.remove();
  }, [isActive]);

  return (
    <SafeAreaView style={styles.sensorContainer}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.sensorHeader}>Device Motion Sensor</Text>
      <SensorDataVisualizer x={data.x} y={data.y} z={data.z} />
      <View style={styles.dataBox}>
        <Text style={styles.dataText}>X: {data.x.toFixed(3)}</Text>
        <Text style={styles.dataText}>Y: {data.y.toFixed(3)}</Text>
        <Text style={styles.dataText}>Z: {data.z.toFixed(3)}</Text>
      </View>
      <TouchableOpacity style={[styles.toggleButton, {backgroundColor: isActive ? theme.accent : '#34C759'}]} onPress={() => setIsActive(!isActive)}>
        <Text style={styles.toggleButtonText}>{isActive ? 'Pause Sensor' : 'Resume Sensor'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const QuoteExpoScreen = ({ navigation }) => {
  const { quotes, loading, error, refreshing, fetchQuotes, addQuote, updateQuote } = useContext(QuoteContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [formData, setFormData] = useState({ character: '', quote: '', anime: '' });
  const [formError, setFormError] = useState('');

  const handleRefresh = useCallback(() => fetchQuotes(true), [fetchQuotes]);

  const handleOpenModal = (quote = null) => {
    setFormError('');
    if (quote) {
      setIsEditing(true);
      setCurrentQuote(quote);
      setFormData({ character: quote.character, quote: quote.quote, anime: quote.anime });
    } else {
      setIsEditing(false);
      setCurrentQuote(null);
      setFormData({ character: '', quote: '', anime: '' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.character.trim() || !formData.quote.trim() || !formData.anime.trim()) {
      setFormError('All fields are required');
      return;
    }
    isEditing ? await updateQuote(currentQuote.id, formData) : await addQuote(formData);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>Anime Quote Explorer 🎌</Text>
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}><ActivityIndicator size="large" color={theme.accent} /><Text style={styles.loadingText}>Loading wise words...</Text></View>
      ) : (
        <FlatList
          data={quotes}
          renderItem={({ item }) => <QuoteCard quote={item} onEdit={handleOpenModal} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={!loading && (<View style={styles.centerContainer}><Text style={styles.emptyText}>{error || 'No quotes found.'}</Text><Button title="Retry" onPress={() => fetchQuotes()} color={theme.accent} /></View>)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.accent]} tintColor={theme.accent} />}
        />
      )}
      
      <TouchableOpacity style={styles.sensorButton} onPress={() => navigation.navigate('SensorData')}><Text style={styles.sensorButtonText}>Show Motion Sensor</Text></TouchableOpacity>
      
      <TouchableOpacity style={styles.fab} onPress={() => handleOpenModal()}><Text style={styles.fabIcon}>+</Text></TouchableOpacity>
      
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Quote' : 'Add New Quote'}</Text>
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
            <TextInput style={styles.input} placeholder="Character" value={formData.character} onChangeText={(text) => setFormData(p => ({ ...p, character: text }))} placeholderTextColor={theme.placeholder} />
            <TextInput style={styles.input} placeholder="Anime" value={formData.anime} onChangeText={(text) => setFormData(p => ({ ...p, anime: text }))} placeholderTextColor={theme.placeholder} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Quote" value={formData.quote} onChangeText={(text) => setFormData(p => ({ ...p, quote: text }))} multiline placeholderTextColor={theme.placeholder} />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color={theme.secondaryText} />
              <Button title="Save" onPress={handleSave} color={theme.accent} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



const Stack = createStackNavigator();

export default function App() {
  return (
    <QuoteProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.card, shadowOpacity: 0 }, headerTintColor: theme.accent, headerTitleStyle: { fontWeight: 'bold' } }}>
          <Stack.Screen name="QuoteExpo" component={QuoteExpoScreen} options={{ title: 'Anime Quote Explorer' }} />
          <Stack.Screen name="SensorData" component={SensorScreen} options={{ title: 'Motion Sensor' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QuoteProvider>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginVertical: 16, color: theme.primaryText, paddingHorizontal: 16 },
  card: { backgroundColor: theme.card, borderRadius: 12, marginVertical: 8, marginHorizontal: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
  image: { width: '100%', height: 160 },
  cardContent: { padding: 16 },
  quoteText: { fontSize: 16, fontStyle: 'italic', color: theme.primaryText, marginBottom: 12, lineHeight: 22 },
  title: { fontSize: 18, fontWeight: '600', color: theme.accent, alignSelf: 'flex-end' },
  animeText: { fontSize: 14, color: theme.secondaryText, alignSelf: 'flex-end', marginTop: 4 },
  editButton: { marginTop: 16, backgroundColor: theme.accent2, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'flex-start' },
  editButtonText: { color: theme.background, fontWeight: 'bold', fontSize: 14 },
  fab: { position: 'absolute', right: 24, bottom: 90, backgroundColor: theme.accent, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8, zIndex: 10 },
  fabIcon: { fontSize: 28, color: theme.buttonText, fontWeight: '300' },
  sensorButton: { backgroundColor: theme.accent2, paddingVertical: 14, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16, marginBottom: 24, position: 'absolute', bottom: 0, left: 0, right: 0 },
  sensorButtonText: { color: theme.background, fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: theme.card, padding: 24, borderRadius: 12, width: '90%', maxWidth: 400, borderWidth: 1, borderColor: theme.border },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: theme.primaryText },
  input: { borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, backgroundColor: theme.background, color: theme.primaryText },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  sensorContainer: { flex: 1, backgroundColor: theme.background, padding: 16, justifyContent: 'center' },
  sensorHeader: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center', color: theme.primaryText },
  dataBox: { padding: 20, backgroundColor: theme.card, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: theme.border },
  dataText: { fontSize: 18, lineHeight: 32, fontWeight: '500', color: theme.primaryText },
  toggleButton: { padding: 16, borderRadius: 25, marginTop: 24, alignItems: 'center' },
  toggleButtonText: { color: theme.buttonText, fontSize: 18, fontWeight: '600' },
  visualizationContainer: { backgroundColor: theme.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: theme.border },
  axisContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  axisLabel: { width: 20, fontWeight: '700' },
  axisTrack: { flex: 1, height: 20, backgroundColor: theme.background, borderRadius: 10, overflow: 'hidden', marginLeft: 12, borderWidth: 1, borderColor: theme.border },
  axisValue: { height: '100%', borderRadius: 10 },
  errorText: { color: theme.accent, textAlign: 'center', marginVertical: 12, paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
  emptyText: { fontSize: 18, color: theme.secondaryText, marginBottom: 20, textAlign: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: theme.secondaryText }
});
