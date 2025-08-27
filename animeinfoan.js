import React, { useEffect, useState } from "react";
import { Image } from 'expo-image';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const DetailAnime = ({ route, navigation }) => {
  const { link, judul } = route.params;
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("Info");
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [loadingSeiyuu, setLoadingSeiyuu] = useState(true);
  const [seiyuus, setSeiyuus] = useState([]);
 
  // state untuk karakter yang dipilih
  const [activeIndex, setActiveIndex] = useState(null);


  // seiyu otakuotaku
   useEffect(() => {
  const fetchSeiyuu = async () => {
    try {
      setLoadingSeiyuu(true);
      const response = await fetch(
        `https://otakudesu-apifree.up.railway.app/api/anime/otakotaku/search?q=${encodeURIComponent(judul)}`
      );
      const data = await response.json();
      if (data?.anime?.characters) {
        // Ambil seiyuu unik dari karakter
        const seiyuuList = data.anime.characters
          .filter(c => c.seiyuuName)
          .map(c => ({
            skor: data.anime.skor,
            seiyuuName: c.seiyuuName,
            seiyuuImg: c.seiyuuImg,
            link: c.seiyuuLink,
            charName: c.charName,
            charImg: c.charImg
          }));
        setSeiyuus(seiyuuList);
      } else {
        setSeiyuus([]);
      }
    } catch (err) {
      console.error(err);
      setSeiyuus([]);
    } finally {
      setLoadingSeiyuu(false);
    }
  };

  fetchSeiyuu();
}, [judul]);



  // Fetch karakter anime
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(
          `https://otakudesu-apifree.up.railway.app/api/zerochan/characters?q=${encodeURIComponent(judul)}`
        );
        const data = await res.json();
        // Hanya karakter yang ada namanya
        setCharacters((Array.isArray(data) ? data : []).filter(c => c.name && c.name.trim() !== ""));
      } catch (err) {
        setCharacters([]);
      } finally {
        setLoadingCharacters(false);
      }
    };
    if (judul) fetchCharacters();
  }, [judul]);

  // Fetch anime detail
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch(
          `https://otakudesu-apifree.up.railway.app/api/anime/detail?link=${encodeURIComponent(link)}`
        );
        const data = await res.json();
        setAnime(data);
      } catch (err) {
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [link]);

  // Fetch zerochan image
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `https://otakudesu-apifree.up.railway.app/api/zerochan/search?q=${encodeURIComponent(judul)}`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const sorted = data.sort((a, b) => b.fav - a.fav);
          setBannerUrl(sorted[0]?.thumbnail || null);
        }
      } catch (err) {
        setBannerUrl(null);
      }
    };
    if (judul) fetchBanner();
  }, [judul]);

  if (loading) {
    return (
      <LinearGradient colors={["#181826", "#232347"]} style={styles.center}>
    <ActivityIndicator size="large" color="#8e44ad" style={{ marginTop: 20 }} />
        <Text style={{ color: "#fff", marginTop: 8, fontWeight: "bold" }}>
          Loading...
        </Text>
      </LinearGradient>
    );
  }

  if (!anime) {
    return (
      <LinearGradient colors={["#222831", "#393E46"]} style={styles.center}>
        <Text style={{ color: "#FFD700", fontWeight: "bold" }}>
          Data tidak ditemukan
        </Text>
      </LinearGradient>
    );
  }

  const renderEpisode = ({ item }) => (
    <TouchableOpacity
      style={styles.episodeItem}
      onPress={async () => {
        try {
          const res = await fetch(
            `https://otakudesu-apifree.up.railway.app/api/anime/detail/video?link=${encodeURIComponent(item.link)}`
          );
          const data = await res.json();
          if (data.video) {
            navigation.navigate("VideoPlayer", { videoUrl: data.video, title: item.title });
          } else {
            alert("Video tidak ditemukan");
          }
        } catch (err) {
          console.error(err);
          alert("Gagal memuat video");
        }
      }}
    >
      <View style={styles.episodeLeft}>
        <Ionicons
          name="play-circle"
          size={20}
          color="#8e44ad"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.episodeTitle}>{item.title}</Text>
      </View>
      <Text style={styles.episodeDate}>{item.tanggal}</Text>
    </TouchableOpacity>
  );

  const tabOptions = [
    { key: "About Anime", label: "Sinopsis" },
    { key: "Episodes", label: "Episode" },
    { key: "Info", label: "Info" },
    { key: "Character", label: "Character" },
     { key: "Seiyu", label: "Seiyu" },
  ];

  return (
    <ScrollView style={{ flex: 2, backgroundColor: "#181826" }}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
       <Image
  source={{ uri: bannerUrl || anime?.thumbnail }}
  style={styles.banner}
  contentFit="cover"
/>

        <LinearGradient
          colors={["rgba(34,40,49,0.8)", "rgba(57,62,70,0.2)"]}
          style={styles.bannerOverlay}
        />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#a29bfe" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Anime</Text>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark-outline" size={26} color="#a29bfe" />
        </TouchableOpacity>
      </View>

      {/* Poster + Judul */}
      <View style={styles.posterRow}>
        <LinearGradient
          colors={["#8e2de2", "#4a00e0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileBorder}
        >
          <Image
            source={{ uri: anime.thumbnail }}
            style={styles.poster}
            resizeMode="cover"
          />
        </LinearGradient>
        <View style={styles.detailCol}>
          <Text style={styles.title} numberOfLines={2}>
            {anime.judul}
          </Text>
        <View style={styles.ratingRow}>
  <Ionicons name="star" size={19} color="#a29bfe" />
<Text style={styles.infoText}>{seiyuus[0]?.skor || "-"}</Text>
</View>
        </View>
      </View>

      {/* Info tambahan */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color="#a29bfe" />
          <Text style={styles.infoText}>{anime.info.tanggal || "-"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#a29bfe" />
          <Text style={styles.infoText}> {anime.info.hari || "Sudah Tamat"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="film-outline" size={16} color="#a29bfe" />
          <Text style={styles.infoText}>{anime.info.episode || "-"}</Text>
        </View>
      </View>

      {/* Tabs - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={{ alignItems: "center", paddingLeft: 16, paddingRight: 8 }}
      >
        {tabOptions.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tabButton,
              activeTab === tab.key ? styles.activeTabButton : null,
            ]}
          >
            <Text
              style={[
                styles.tab,
                activeTab === tab.key ? styles.activeTab : null,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.tabContent}>
        {activeTab === "About Anime" && (
          <Text style={styles.desc}>
            {anime.sinopsis || "Tidak ada sinopsis"}
          </Text>
        )}
        {activeTab === "Episodes" && (
          <FlatList
            data={anime.episode}
            renderItem={renderEpisode}
            keyExtractor={(item, i) => i.toString()}
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingVertical: 8,
            }}
            ListEmptyComponent={
              <Text style={styles.emptyEpisode}>Belum ada episode.</Text>
            }
          />
        )}
        {activeTab === "Info" && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelText}>
              Judul: <Text style={{ color: "#fff" }}>{anime.judul}</Text>
            </Text>
            <Text style={styles.infoPanelText}>
              Episode:{" "}
              <Text style={{ color: "#fff" }}>{anime.info.episode}</Text>
            </Text>
            <Text style={styles.infoPanelText}>
              Hari: <Text style={{ color: "#fff" }}> {anime.info.hari || "Sudah Tamat"} </Text>
            </Text>
            <Text style={styles.infoPanelText}>
              Tanggal:{" "}
              <Text style={{ color: "#fff" }}>{anime.info.tanggal}</Text>
            </Text>
          </View>
        )}
        {activeTab === "Character" && (
  loadingCharacters || loadingSeiyuu ? (
    <ActivityIndicator size="large" color="#8e44ad" style={{ marginTop: 20 }} />
  ) : characters.length === 0 && seiyuus.length === 0 ? (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Image
        source={{ uri: "https://media.tenor.com/_GIpT84FZTQAAAAi/llorar-llorando.gif" }}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
      <Text style={{ color: "#fff", marginTop: 8 }}>Character / Seiyuu tidak ditemukan</Text>
    </View>
  ) : (
    <FlatList
      data={characters.length ? characters : seiyuus}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
      numColumns={2}
      renderItem={({ item, index }) => {
        // fallback ke charImg kalau thumbnail kosong
        const imageUrl = item.thumbnail && item.thumbnail.trim() !== ""
          ? item.thumbnail
          : item.charImg || item.charImg; // kalau charImg juga kosong, pakai seiyuuImg
        const name = item.name || item.charName;

        return (
          <TouchableOpacity
            style={styles.characterCardBig}
            activeOpacity={0.85}
            onPress={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <Image
              source={{ uri: imageUrl }}
              style={[styles.characterImageBig, activeIndex === index && { opacity: 0.45 }]}
              contentFit="cover"
            />
            {activeIndex === index && (
              <View style={styles.characterNameOverlay}>
                <Text style={styles.characterNameOverlayText}>{name}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  )
)}


        {activeTab === "Seiyu" && (
  loadingSeiyuu ? (
    <ActivityIndicator size="large" color="#8e44ad" style={{ marginTop: 20 }} />
  ) : seiyuus.length === 0 ? (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Image
        source={{ uri: "https://media.tenor.com/_GIpT84FZTQAAAAi/llorar-llorando.gif" }}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
      <Text style={{ color: "#fff", marginTop: 8 }}>Seiyuu nya hilang</Text>
    </View>
  ) : (
    <FlatList
      data={seiyuus}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
      numColumns={2}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={styles.characterCardBig}
          activeOpacity={0.85}
          onPress={() => setActiveIndex(activeIndex === index ? null : index)}
        >
          <Image
            source={{ uri: item.seiyuuImg }}
            style={[styles.characterImageBig, activeIndex === index && { opacity: 0.45 }]}
            contentFit="cover"
          />
          {activeIndex === index && (
            <View style={styles.characterNameOverlay}>
              <Text style={styles.characterNameOverlayText}>{item.seiyuuName}</Text>
              <Text style={{ color: "#ccc", fontSize: 12 }}>{item.charName}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  )
)}


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    marginBottom: -60,
    marginTop:20
  },
  banner: {
    width: "100%",
    height: 180,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  backBtn: { position: "absolute", left: 16, top: 36, zIndex: 2 },
  bookmarkBtn: { position: "absolute", right: 16, top: 36, zIndex: 2 },
  headerTitle: {
    position: "absolute",
    top: 36,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#a29bfe",
    fontWeight: "bold",
    fontSize: 20,
    zIndex: 1,
    textShadowColor: "#222831",
    textShadowRadius: 7,
  },

  posterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -54,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  profileBorder: {
    padding: 3,
    borderRadius: 17,
  },
  poster: {
    width: 92,
    height: 130,
    borderRadius: 14,
    backgroundColor: "#393E46",
  },
  detailCol: { marginLeft: 14, justifyContent: "center", flex: 1 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 1 },
  rating: { color: "#FFD700", fontSize: 16, marginLeft: 6, fontWeight: "bold" },

  infoRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 13,
    backgroundColor: "#232347",
    borderRadius: 16,
    marginHorizontal: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: "#FFD700",
    shadowOpacity: 0.11,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: { flexDirection: "row", alignItems: "center" },
  infoText: { color: "#fff", marginLeft: 8, fontSize: 15, fontWeight: "600" },

  tabs: {
    flexDirection: "row",
    marginTop: 28,
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderColor: "#393E46",
    backgroundColor: "transparent",
  },
  tabButton: {
    marginRight: 28,
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTabButton: {
    borderColor: "#8e44ad",
    borderBottomWidth: 2,
  },
  tab: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  activeTab: {
    color: "#8e44ad",
  },

  tabContent: {
    minHeight: 80,
    marginTop: 2,
    marginBottom: 32,
    paddingHorizontal: 18,
  },
  desc: {
    color: "#fff",
    fontSize: 15.5,
    lineHeight: 22,
    marginBottom: 27,
    marginTop: 2,
  },

  episodeItem: {
    backgroundColor: "#232347",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 1,
  },
  episodeLeft: { flexDirection: "row", alignItems: "center" },
  episodeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15.5,
    letterSpacing: 0.5,
  },
  episodeDate: { color: "#bdbdbd", fontSize: 13 },

  emptyEpisode: {
    color: "#bdbdbd",
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
  },

  infoPanel: {
    backgroundColor: "#232347",
    borderRadius: 10,
    padding: 18,
    marginTop: 4,
  },
  infoPanelText: {
    color: "#bdbdbd",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },

  // Character grid besar, overlay nama saat klik
  characterCardBig: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#232347",
    aspectRatio: 0.62,
    overflow: "hidden",
    elevation: 2,
    position: "relative",
  },
  characterImageBig: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#393E46",
  },
  characterNameOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(24,24,38,0.45)",
    borderRadius: 20,
  },
  characterNameOverlayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 21,
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  
    borderRadius: 15,
    overflow: "hidden",
    textShadowColor: "#000",
    textShadowRadius: 8,
  },
});

export default DetailAnime;