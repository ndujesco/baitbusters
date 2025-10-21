// App.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Easing,
  FlatList,
  Linking,
  NativeModules,
  Platform,
  PermissionsAndroid,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  EmitterSubscription,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BACKEND_URL = "https://baitbusters.onrender.com/predict";

type SmsLog = {
  id: string;
  from: string | null;
  body: string;
  receivedAt: number;
  status: "received" | "sending_backend" | "backend_error" | "sending_sms" | "sent" | "sms_error";
  backendReply?: string;
  error?: string;
};

const { SmsListenerModule, SmsSenderModule } = (NativeModules as any) || {};

const showToast = (msg: string) => {
  if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Idle");
  const [logs, setLogs] = useState<SmsLog[]>([]);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const sendingAnim = useRef(new Animated.Value(0)).current;

  // refs and dedupe scaffolding
  const subscriptionRef = useRef<EmitterSubscription | null>(null);
  const recentMessagesRef = useRef<Set<string>>(new Set()); // dedupe by from|body
  const idCountRef = useRef<Record<string, number>>({}); // ensure unique ids for same timestamp
  const processedIdsRef = useRef<Set<string>>(new Set()); // track processed ids to avoid re-processing

  // animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(sendingAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [sendingAnim]);

  // request permissions on mount
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== "android") {
          setHasPermissions(true);
          return;
        }
        const permissions = [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, PermissionsAndroid.PERMISSIONS.SEND_SMS];
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const ok =
          granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermissions(ok);
        if (!ok) showToast("SMS permissions are required for gateway functionality.");
      } catch (err) {
        console.warn("Permission error:", err);
        setHasPermissions(false);
      }
    })();
  }, []);

  // manage SMS listener subscription and dedupe
  useEffect(() => {
    // cleanup any old subscription (defensive)
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.remove();
      } catch (_) { }
      subscriptionRef.current = null;
    }

    if (listening) {
      setStatusText("Listening for messages");
      try {
        SmsListenerModule?.startListeningToSMS();
      } catch (err) {
        console.warn("SmsListenerModule.startListeningToSMS error:", err);
      }

      const sub = DeviceEventEmitter.addListener("onSMSReceived", async (payload: string) => {
        // parse payload (native emits JSON string)
        let parsed: any;
        try {
          parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
        } catch (e) {
          parsed = payload;
        }

        const body = (parsed.messageBody ?? parsed.body ?? "").trim();
        const from = parsed.senderPhoneNumber ?? parsed.origin ?? "unknown";
        const timestamp = parsed.timestamp ?? Date.now();

        // dedupe by from|body for a short window
        const dedupeKey = `${from}|${body}`;
        if (recentMessagesRef.current.has(dedupeKey)) {
          console.log("Duplicate SMS ignored (recent):", dedupeKey);
          return;
        }
        recentMessagesRef.current.add(dedupeKey);
        setTimeout(() => recentMessagesRef.current.delete(dedupeKey), 30_000);

        // unique id: timestamp + counter (guards identical timestamps)
        const tsKey = `${from}_${timestamp}`;
        const count = (idCountRef.current[tsKey] ?? 0) + 1;
        idCountRef.current[tsKey] = count;
        setTimeout(() => delete idCountRef.current[tsKey], 60_000);
        const uniqueId = `${tsKey}_${count}`;

        // guard against processing same id twice
        if (processedIdsRef.current.has(uniqueId)) {
          console.log("Already processed id (early):", uniqueId);
          return;
        }
        processedIdsRef.current.add(uniqueId);
        // cleanup processed id after some time to avoid memory leak
        setTimeout(() => processedIdsRef.current.delete(uniqueId), 5 * 60_000);

        const logItem: SmsLog = {
          id: uniqueId,
          from,
          body,
          receivedAt: timestamp,
          status: "received",
        };

        setLogs((prev) => {
          // avoid duplicate keys in UI list
          if (prev.some((l) => l.id === logItem.id)) return prev;
          return [logItem, ...prev];
        });

        void processSms(logItem);
      });

      subscriptionRef.current = sub;
    } else {
      // stopping: notify native module and remove subscription
      try {
        SmsListenerModule?.stopListeningToSMS();
      } catch (err) {
        // ignore if not implemented
      }
      if (subscriptionRef.current) {
        const sub = (subscriptionRef as unknown as {current: any}).current; // <-- keeps correct type
        try {
          sub.remove();
        } catch (_) { }
        subscriptionRef.current = null;
      }

    }

    // cleanup on unmount too
    return () => {
      try {
        SmsListenerModule?.stopListeningToSMS();
      } catch (_) { }
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.remove();
        } catch (_) { }
        subscriptionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // process pipeline: send to backend then reply
  const processSms = async (logItem: SmsLog) => {
    // double-check processed set (defensive)
    if (processedIdsRef.current.has(logItem.id) === false) {
      processedIdsRef.current.add(logItem.id);
      setTimeout(() => processedIdsRef.current.delete(logItem.id), 5 * 60_000);
    } else {
      // already queued/processed
    }

    updateLogStatus(logItem.id, { status: "sending_backend" });
    setStatusText("Sending message to backend...");

    let backendReply: string | undefined;
    try {
      showToast('Sending to backend')
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: logItem.body }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Backend returned ${res.status}: ${t}`);
      }
      const data = await res.json();
      backendReply = data?.reply ?? String(data);
      updateLogStatus(logItem.id, { backendReply, status: "sending_sms" });
    } catch (err: any) {
      console.warn("Backend error:", err);
      updateLogStatus(logItem.id, { status: "backend_error", error: err?.message ?? String(err) });
      setStatusText("Backend error");
      return;
    }

    setStatusText("Sending SMS reply...");
    try {
      if (SmsSenderModule?.sendSMS) {
        await SmsSenderModule.sendSMS(logItem.from, backendReply);
      } else {
        const smsUrl = `sms:${logItem.from ?? ""}?body=${encodeURIComponent(backendReply ?? "")}`;
        await Linking.openURL(smsUrl);
      }
      updateLogStatus(logItem.id, { status: "sent", backendReply });
      setStatusText("Reply sent");
      showToast("Reply sent");
    } catch (err: any) {
      console.warn("Send SMS error:", err);
      updateLogStatus(logItem.id, { status: "sms_error", error: err?.message ?? String(err) });
      setStatusText("Failed to send SMS");
    }
  };

  const updateLogStatus = (id: string, patch: Partial<SmsLog>) => {
    setLogs((s) => s.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const toggleListening = async () => {
    if (!hasPermissions && Platform.OS === "android") {
      const permissions = [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, PermissionsAndroid.PERMISSIONS.SEND_SMS];
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const ok =
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED;
      setHasPermissions(ok);
      if (!ok) {
        showToast("SMS permissions required");
        return;
      }
    }

    // toggle value
    setListening((v) => !v);
    if (!listening) {
      setStatusText("Listening for messages");
      showToast("Started listening for SMS");
    } else {
      setStatusText("Stopped");
      showToast("Stopped listening");
    }
  };

  const renderLogItem = ({ item }: { item: SmsLog }) => {
    const time = new Date(item.receivedAt).toLocaleTimeString();
    const statusColor =
      item.status === "received"
        ? "#f6c85f"
        : item.status === "sending_backend"
          ? "#4f83cc"
          : item.status === "sending_sms"
            ? "#a17dd1"
            : item.status === "sent"
              ? "#2bb673"
              : "#f05555";

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text style={styles.logFrom}>{item.from ?? "Unknown sender"}</Text>
          <Text style={{ color: "#666" }}>{time}</Text>
        </View>
        <Text style={styles.logBody}>{item.body}</Text>
        <View style={styles.logFooter}>
          <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
            <Text style={styles.statusPillText}>{item.status.replace("_", " ")}</Text>
          </View>
          {item.backendReply ? <Text style={styles.replyText}>↪ {item.backendReply}</Text> : null}
        </View>
      </View>
    );
  };

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.6] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });
  const spin = sendingAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>BaitBusters Gateway</Text>
        <Text style={styles.subtitle}>Transmitter Hub — Live Messaging</Text>
      </View>

      <View style={styles.centerCard}>
        <View style={styles.transmitterRow}>
          <View style={styles.transmitterContainer}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
            <View style={styles.transmitterCore}>
              <View style={styles.coreDot} />
            </View>
          </View>

          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusMain}>{statusText}</Text>

            <View style={styles.controls}>
              <Pressable onPress={toggleListening} style={({ pressed }) => [styles.button, pressed && { opacity: 0.75 }]}>
                <Text style={styles.buttonText}>{listening ? "Stop Listening" : "Start Listening"}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setLogs([]);
                  showToast("Cleared logs");
                }}
                style={({ pressed }) => [styles.ghostButton, pressed && { opacity: 0.75 }]}
              >
                <Text style={styles.ghostText}>Clear logs</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.activityRow}>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Incoming</Text>
            <Text style={styles.activityValue}>{logs.length}</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Last action</Text>
            <Text style={styles.activityValue}>{logs[0]?.status ?? "—"}</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Permissions</Text>
            <Text style={[styles.activityValue, { color: hasPermissions ? "#2bb673" : "#f05555" }]}>
              {hasPermissions ? "Granted" : "Missing"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.logList}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.logTitle}>Message Log</Text>
          <View style={styles.logCount}>
            <Text style={styles.logCountText}>{logs.length}</Text>
          </View>
        </View>

        <FlatList
          data={logs}
          keyExtractor={(i) => i.id}
          renderItem={renderLogItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: "#666" }}>No messages yet — waiting for incoming SMS.</Text>
              <Text style={{ color: "#666", marginTop: 6 }}>Make sure permissions are granted.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </View>

      {logs[0]?.status === "sending_backend" || logs[0]?.status === "sending_sms" ? (
        <Animated.View style={[styles.sendingBadge, { transform: [{ rotate: spin }] }]}>
          <ActivityIndicator color="#fff" />
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtitle: { color: "#666", marginTop: 4 },

  centerCard: {
    margin: 16,
    backgroundColor: "#fbfbff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  transmitterRow: { flexDirection: "row", alignItems: "center" },
  transmitterContainer: {
    width: 96,
    height: 96,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#80bfff",
  },
  transmitterCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eaf4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  coreDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#2b8cff" },

  statusBlock: { flex: 1, paddingLeft: 6 },
  statusLabel: { color: "#888", fontSize: 12 },
  statusMain: { fontSize: 16, fontWeight: "600", marginTop: 6 },

  // controls now wrap so Clear logs won't overflow
  controls: { flexDirection: "row", marginTop: 12, alignItems: "center", flexWrap: "wrap" },
  button: {
    backgroundColor: "#2b8cff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 140,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  ghostButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 110,
    marginTop: 8,
  },
  ghostText: { color: "#333" },

  activityRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  activityItem: { alignItems: "center", flex: 1 },
  activityLabel: { color: "#999", fontSize: 12 },
  activityValue: { fontSize: 14, fontWeight: "700", marginTop: 6 },

  logList: { flex: 1, paddingHorizontal: 16, marginTop: 8 },
  logHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  logTitle: { fontWeight: "700", fontSize: 16 },
  logCount: { backgroundColor: "#f0f4ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  logCountText: { color: "#2b8cff", fontWeight: "700" },

  empty: { padding: 16, alignItems: "center" },

  logCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f1f3f6",
  },
  logHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  logFrom: { fontWeight: "700" },
  logBody: { color: "#222", marginBottom: 8 },
  logFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  replyText: { color: "#666", marginLeft: 8 },

  sendingBadge: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2b8cff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
});
