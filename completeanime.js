import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Dimensions
} from "react-native";

const { width } = Dimensions.get("window");

export default function CompleteAnime() {
   const navigation = useNavigation();
  const [completeAnime, setCompleteAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = 63;

  const fetchAnime = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`https://otakudesutawny.vercel.app/api/anime/complete/page/${pageNumber}`);
      const data = await res.json();
      setCompleteAnime(data);
      setPage(pageNumber);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(1);
  }, []);

  

  const renderAnime = ({ item }) => (
  <TouchableOpacity 
    style={styles.cardAnime}
    onPress={() => navigation.navigate("DetailAnime", { 
  link: item.link,
  judul: item.judul
})} // 
  >
    <Image source={{ uri: item.thumbnail }} style={styles.animeImage} />
    <View style={{ flex: 1, marginLeft: 14 }}>
      <Text numberOfLines={2} style={styles.animeTitle}>{item.judul}</Text>
      <Text style={styles.animeInfo}>{item.episode} • {item.tanggal}</Text>
    </View>
  </TouchableOpacity>
);


  // Fungsi tombol back: reset ke halaman pertama
  const handleBack = () => {
    if (page !== 1) fetchAnime(1);
    // Jika pakai React Navigation, ganti dengan navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.container}>
            <View style={styles.header}>
          <View style={styles.profileWelcome}> 
            <View style={styles.profileWrapper}>
              <LinearGradient
                colors={["#8e2de2", "#4a00e0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.profileBorder}
              >
                <Image
                  source={{ uri: "https://images.alphacoders.com/135/1356687.jpeg" }}
                  style={styles.profile}
                />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.welcome}>Welcome back</Text>
              <Text style={styles.name}>Merunime</Text>
            </View>
            
          </View>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        </View>

      {/* Tombol Back */}
      <View style={styles.header1}>
        <Text style={styles.subTitle}>Page {page} / {totalPages}</Text>
        <Text style={styles.sectionTitle}>Complete Anime</Text>
      </View>
     

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e44ad" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={completeAnime}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAnime}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Pagination Bar */}
      <View style={styles.paginationWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.pageButton,
                page === num && styles.pageButtonActive,
              ]}
              onPress={() => !loading && fetchAnime(num)}
              disabled={loading}
            >
              <Text style={[
                styles.pageText,
                page === num && styles.pageTextActive,
              ]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#181826", paddingTop: 16 },

  header1:{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight:24},
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 20 },
  profileWelcome: { flexDirection: "row", alignItems: "center" },
  profileWrapper: { marginRight: 15 },
  profileBorder: {
    padding: 2,
    borderRadius: 30,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  profile: { width: 50, height: 50, borderRadius: 25 },
  welcome: { color: "#ccc", fontSize: 14 },
  name: { color: "#fff", fontSize: 20, fontWeight: "bold" },

 
  backButton: { marginRight: 12, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#232347", borderRadius: 8 },
  backButtonText: { color: "#a29bfe", fontSize: 16, fontWeight: "bold" },
  sectionTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subTitle: { color: "#a29bfe", fontSize: 14, fontWeight: "500", paddingLeft: 18, marginBottom: 10, },
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },
  cardAnime: {
    flexDirection: "row",
    backgroundColor: "#232347",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#8e44ad",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  animeImage: { width: 80, height: 120, borderRadius: 10, backgroundColor: "#444" },
  animeTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  animeInfo: { color: "#b2bec3", fontSize: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#aaa", marginTop: 10, fontSize: 15 },
  paginationWrapper: {
    position: "absolute",
    bottom: 50, // naikkan dari 18 ke 60
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#232347bb",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#8e44ad",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#28285a",
    marginRight: 7,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#393970",
    transition: 'background-color 0.2s',
  },
  pageButtonActive: {
    backgroundColor: "#8e44ad",
    borderColor: "#fff",
  },
  pageText: { color: "#dfe6e9", fontSize: 15, fontWeight: "500" },
  pageTextActive: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});