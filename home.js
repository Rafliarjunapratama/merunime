import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const SIDEBAR_WIDTH = 260;
const SCREEN_WIDTH = Dimensions.get("window").width;

const dayOrder = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
  "None",
  "Random",
];

function groupAnimeByDay(animeList) {
  const grouped = animeList.reduce((acc, anime) => {
    const hari = anime.hari || "None";
    if (!acc[hari]) acc[hari] = [];
    acc[hari].push(anime);
    return acc;
  }, {});
  return dayOrder.map((day) => ({
    title: day,
    data: grouped[day] || [],
  }));
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [completeAnime, setCompleteAnime] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(true);
  const [errorComplete, setErrorComplete] = useState(null);

  const [jadwal, setJadwal] = useState([]);
  const [activeDay, setActiveDay] = useState("Senin");
  const [search, setSearch] = useState("");

  // Sidebar animation
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Dropdown Komik
  const [komikDropdown, setKomikDropdown] = useState(false);

  useEffect(() => {
    fetch("https://otakudesutawny.vercel.app/api/anime")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data on-going");
        return res.json();
      })
      .then((data) => {
        setAnime(data);
        setLoading(false);
        setJadwal(groupAnimeByDay(data));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("https://otakudesutawny.vercel.app/api/anime/complete")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data complete");
        return res.json();
      })
      .then((data) => {
        setCompleteAnime(data);
        setLoadingComplete(false);
      })
      .catch((err) => {
        setErrorComplete(err.message);
        setLoadingComplete(false);
      });
  }, []);

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarVisible ? SCREEN_WIDTH - SIDEBAR_WIDTH : SCREEN_WIDTH,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible]);

  // Filter anime ongoing
  const filteredAnime = anime.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.episode && item.episode.toLowerCase().includes(search.toLowerCase()))
  );
  // Filter anime complete
  const filteredCompleteAnime = completeAnime.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.episode && item.episode.toLowerCase().includes(search.toLowerCase()))
  );
  // Filter jadwal hari aktif
  const filteredJadwalAnime = (
    jadwal.find((h) => h.title === activeDay)?.data || []
  ).filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.episode && item.episode.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading || loadingComplete) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6a5acd" />
        <Text style={{ color: "#fff" }}>Mengambil data anime...</Text>
      </SafeAreaView>
    );
  }

  if (error || errorComplete) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "red" }}>
          Terjadi error: {error || errorComplete}
        </Text>
      </SafeAreaView>
    );
  }

  // Data dummy New Releases
  const newReleases = [
    {
      id: "1",
      title: "One Piece",
      studio: "Toei Animation",
      link: "https://otakudesu.best/anime/1piece-sub-indo/",
      image: "https://giffiles.alphacoders.com/221/221024.gif",
    },
    {
      id: "2",
      title: "Hunter X Hunter",
      studio: "Nippon Animation dan Madhouse",
      link: "https://otakudesu.best/anime/hunt-hunt-sub-indo/",
      image: "https://giffiles.alphacoders.com/142/142513.gif",
    },
    {
      id: "3",
      title: "Demon Slayer: Kimetsu No \nYaiba",
      studio: "Ufotable",
      link: "https://otakudesu.best/anime/kimetsu-yaiba-subtitle-indonesia/",
      image: "https://giffiles.alphacoders.com/221/221017.gif",
    },
    {
      id: "4",
      title: "Fate/Grand Order",
      studio: "Ufotable",
      link: "https://otakudesu.best/anime/fgo-zettai-babylonia-sub-indo/",
      image: "https://giffiles.alphacoders.com/134/13487.gif",
    },
  ];
  // Filter New Releases juga
  const filteredNewReleases = newReleases.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.studio.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar dropdown handler
  const komikDropdownItems = [
    { label: "Manga", icon: <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#6a5acd" />, nav: () => navigation.navigate("MangaScreen") },
    { label: "Manhwa", icon: <MaterialCommunityIcons name="book-open-variant" size={20} color="#4a00e0" />, nav: () => navigation.navigate("ManhwaScreen") },
    { label: "Mahua", icon: <MaterialIcons name="menu-book" size={20} color="#8e2de2" />, nav: () => navigation.navigate("MahuaScreen") },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        {/* SIDEBAR - Modern, Slide from Right */}
        <Animated.View style={[styles.sidebarModern, { left: sidebarAnim, width: SIDEBAR_WIDTH }]}>
          <LinearGradient
            colors={["#1d1f3c", "#4a00e0", "#8e2de2", "#232347"]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
           <ScrollView
    
    contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
    showsVerticalScrollIndicator={false}
  >
          <View style={styles.sidebarContentModern}>
            {/* X Close Button */}
            <TouchableOpacity style={styles.sidebarCloseModern} onPress={() => setSidebarVisible(false)}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            {/* Avatar + Title */}
            <View style={styles.sidebarTopModern}>
            
                <Image
                  source={{
                    uri: "https://images.alphacoders.com/135/1356687.jpeg",
                  }}
                  style={styles.sidebarAvatarModern}
                />
            
              <Text style={styles.sidebarTitleModern}>Merunime</Text>
            </View>
            {/* Komik Dropdown */}
            <View style={styles.menuWrapperModern}>
              <TouchableOpacity
                style={[styles.menuCard, komikDropdown && styles.menuCardActive]}
                onPress={() => setKomikDropdown((v) => !v)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="book" size={26} color="#fff" />
                <Text style={styles.menuTextModern}>Komik</Text>
                <Feather name={komikDropdown ? "chevron-up" : "chevron-down"} size={22} color="#fff" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              {/* Dropdown List */}
              {komikDropdown && (
                <View style={styles.menuDropdownModern}>
                  {komikDropdownItems.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.menuDropdownItemModern}
                      onPress={() => {
                        setKomikDropdown(false);
                        setSidebarVisible(false);
                        item.nav();
                      }}
                      activeOpacity={0.8}
                    >
                      {item.icon}
                      <Text style={styles.menuDropdownTextModern}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {/* Search */}
           <View style={styles.sidebarSearchBoxModern}>
  <Feather name="search" size={15} color="#8e2de2" />
  <TextInput
    style={styles.sidebarSearchInputModern}
    placeholder="Cari anime..."
    placeholderTextColor="#b8b8e0"
    value={search}
    onChangeText={setSearch}
  />
</View>
            {/* Divider Neon */}
            <LinearGradient
              colors={["#8e2de2", "#4a00e0", "#232347"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sidebarDividerModern}
            />
            {/* Social Media */}
            <View style={styles.sidebarSocialWrapperModern}>
              <TouchableOpacity style={styles.sidebarSocialButtonModern}>
                <FontAwesome name="facebook" size={20} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarSocialButtonModern}>
                <AntDesign name="github" size={20} color="#232347" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarSocialButtonModern}>
                <MaterialCommunityIcons name="web" size={20} color="#4a00e0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarSocialButtonModern}>
                <AntDesign name="linkedin-square" size={20} color="#0A66C2" />
              </TouchableOpacity>
            </View>
          </View>
           </ScrollView>
        </Animated.View>
        {/* Overlay to close sidebar */}
        {sidebarVisible && (
          <Pressable style={styles.sidebarOverlay} onPress={() => setSidebarVisible(false)} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentWrapper}
          scrollEnabled={!sidebarVisible}
        >
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
                    source={{
                      uri: "https://images.alphacoders.com/135/1356687.jpeg",
                    }}
                    style={styles.profile}
                  />
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.welcome}>Welcome back</Text>
                <Text style={styles.name}>Merunime</Text>
              </View>
            </View>
            <LinearGradient
              colors={["#8e2de2", "#4a00e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.comicBorder}
            >
              <TouchableOpacity
                style={styles.comicButton}
                onPress={() => setSidebarVisible(true)}
              >
                <Feather name="menu" style={styles.comicButtonText} color="#fff" size={24} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <Text style={styles.sectionReales}>Favorit Visitor</Text>
          <FlatList
            data={filteredNewReleases}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.newReleaseCard}
                onPress={() =>
                  navigation.navigate("DetailAnime", {
                    link: item.link,
                    judul: item.title,
                  })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.newReleaseImage}
                />
                <View style={styles.overlay}>
                  <Text style={styles.movieTitle}>{item.title}</Text>
                  <Text style={styles.studio}>{item.studio}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Complete Anime</Text>
              <TouchableOpacity
                style={styles.completeAllButton}
                onPress={() => navigation.navigate("CompleteAnime")}
              >
                <Text style={styles.completeAllText}>Complete All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredCompleteAnime}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.forYouCard}
                  onPress={() =>
                    navigation.navigate("DetailAnime", {
                      link: item.link,
                      judul: item.judul,
                    })
                  }
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.forYouImage}
                  />
                  <Text style={styles.forYouTitle}>{item.judul}</Text>
                  <Text style={styles.forYouYear}>{item.episode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>On-Going Hari ini</Text>
            <FlatList
              data={filteredAnime}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.forYouCard}
                  onPress={() =>
                    navigation.navigate("DetailAnime", {
                      link: item.link,
                      judul: item.judul,
                    })
                  }
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.forYouImage}
                  />
                  <Text style={styles.forYouTitle}>{item.judul}</Text>
                  <Text style={styles.forYouYear}>{item.episode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              {jadwal.map((hari, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.tabButton,
                    activeDay === hari.title && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveDay(hari.title)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeDay === hari.title && styles.tabTextActive,
                    ]}
                  >
                    {hari.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.jadwalContent}>
              {filteredJadwalAnime.map((anime, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.cardAnime}
                  onPress={() =>
                    navigation.navigate("DetailAnime", {
                      link: anime.link,
                      judul: anime.judul,
                    })
                  }
                >
                  <Image
                    source={{ uri: anime.thumbnail }}
                    style={styles.animeImage}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.animeTitle}>{anime.judul}</Text>
                    <Text style={styles.animeInfo}>
                      {anime.episode} - {anime.tanggal}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {filteredJadwalAnime.length === 0 && (
                <Text style={{ marginTop: 10, color: "#ccc" }}>
                  Tidak ada anime hari {activeDay}.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#181826" },
  mainWrapper: { flex: 1, flexDirection: "row" },
  sidebarModern: {
    position: "absolute",
    top: 0,
    height: "100%",
    right: 0,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    elevation: 24,
    shadowColor: "#8e2de2",
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    overflow: "hidden",
    zIndex: 999,
    backgroundColor: "transparent",
  },
  sidebarContentModern: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 2,
    position: "relative",
  },
  sidebarCloseModern: {
    position: "absolute",
    top: 22,
    left: 22,
    zIndex: 99,
    backgroundColor: "rgba(40,40,60,0.23)",
    borderRadius: 20,
    padding: 6,
    elevation: 6,
    shadowColor: "#4a00e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sidebarTopModern: {
    alignItems: "center",
    marginBottom: 35,
    marginTop: 12,
    width: "100%",
  },
  sidebarAvatarFrame: {
    padding: 4,
    borderRadius: 50,
    shadowColor: "#8e2de2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    backgroundColor: "#232347",
    marginBottom: 10,
  },
  sidebarAvatarModern: {
    width: 70,
    height: 70,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sidebarTitleModern: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 6,
    marginTop: 3,
    letterSpacing: 1.2,
    textAlign: "center",
    fontFamily: "sans-serif-medium",
    textShadowColor: "#8e2de2",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  menuWrapperModern: {
    width: '86%',
    marginBottom: 20,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232347",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: "#6a5acd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "#6a5acd",
  },
  menuCardActive: {
    backgroundColor: "#6a5acd",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "#232347",
  },
  menuTextModern: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 10,
    textShadowColor: "#8e2de2",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  menuDropdownModern: {
   
    borderRadius: 13,
    paddingVertical: 7,
    marginTop: 5,
    shadowColor: "#6a5acd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },
  menuDropdownItemModern: {
    backgroundColor: "#1a1a1a", // isi (bisa hitam, putih, transparan, dll)
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 21,
    borderRadius: 10,
    marginVertical: 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  menuDropdownTextModern: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 13,
    fontWeight: "600",
    textShadowColor: "#8e2de2",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  sidebarSearchBoxModern: {
  flexDirection: "row",
  alignItems: "center",     
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: 20,

  marginBottom: 34,
  width: "86%",
  height: 45,                
  shadowColor: "#8e2de2",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.19,
  shadowRadius: 8,
  elevation: 3,
},

sidebarSearchInputModern: {
  width: 100,  
  height:50,
  flex: 1,                  // isi sisa ruang
  fontSize: 16,
  color: "#fff",
  paddingVertical: 0,       // buang padding default

  fontFamily: "sans-serif",
          // ikut tinggi parent
  includeFontPadding: false,// hilangkan padding font Android
  textAlignVertical: "center", // biar teks pas tengah Android
},



  sidebarDividerModern: {
    width: "68%",
    height: 2.5,
    marginVertical: 24,
    borderRadius: 3,
    alignSelf: "center",
  },
  sidebarSocialWrapperModern: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    gap: 25,
    marginBottom: 12,
    width: "100%",
  },
  sidebarSocialButtonModern: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  
    elevation: 5,
    shadowColor: "#8e2de2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.23,
    shadowRadius: 14,
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH - SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 998,
  },
  contentWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    marginTop:50,
    marginBottom: 10,
  },
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
  section: { marginLeft: 5, marginBottom: 25 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  completeAllButton: {
    backgroundColor: "#232347",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 5,
  },
  completeAllText: {
    color: "#a29bfe",
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionReales: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 12,
  },
  newReleaseCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginLeft: 20,
    marginBottom: 20,
    width: 320,
  },
  newReleaseImage: { width: "100%", height: 180, borderRadius: 12 },
  overlay: { position: "absolute", bottom: 10, left: 10 },
  movieTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  studio: { color: "#ccc", fontSize: 14 },
  forYouCard: {
    width: 120,
    backgroundColor: "#232347",
    borderRadius: 12,
    padding: 7,
    shadowColor: "#8e44ad",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
    marginRight: 13,
    marginLeft: 5,
  },
  forYouImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  forYouTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  forYouYear: {
    color: "#aaa",
    fontSize: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#232347",
    marginRight: 8,
  },
  tabButtonActive: { backgroundColor: "#6a5acd" },
  tabText: { color: "#ccc", fontSize: 14 },
  tabTextActive: { color: "#fff", fontWeight: "bold" },
  cardAnime: {
    flexDirection: "row",
    backgroundColor: "#232347",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  animeImage: { width: 60, height: 80, borderRadius: 8 },
  animeTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  animeInfo: { color: "#aaa", fontSize: 12, marginTop: 4 },
  jadwalContent: { paddingBottom: 20 },
  comicButton: {
    backgroundColor: "#181826",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  comicButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  comicBorder: {
    padding: 2,
    borderRadius: 13,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
});