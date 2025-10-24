import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";

const plans = [

  {
    id: "standard",
    name: "Standard",
    price: 1000,
    messages: 7000,
    detections: 150,
    description: "A balanced plan for regular users and small businesses.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 2500,
    messages: 15000,
    detections: 400,
    description: "For professionals needing extra fraud detection capacity.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 5000,
    messages: 40000,
    detections: 1000,
    description: "High-volume detection for organizations and large teams.",
  },
];

const USER_BALANCE = 1500;

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"confirm" | "success" | "error" | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [subscribedPlan, setSubscribedPlan] = useState<any>(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [renewModal, setRenewModal] = useState(false);

  const handleSubscribe = (plan: any) => {
    if (subscribedPlan && subscribedPlan.id === plan.id) {
      setRenewModal(true);
      return;
    }

    setSelectedPlan(plan);
    setModalType("confirm");
    setModalVisible(true);
  };

  const simulatePayment = () => {
    setModalVisible(false);
    setLoadingPlanId(selectedPlan.id);

    setTimeout(() => {
      setLoadingPlanId(null);

      if (USER_BALANCE >= selectedPlan.price) {
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);

        setSubscribedPlan({
          ...selectedPlan,
          renewalDate,
        });
        setModalType("success");
      } else {
        setModalType("error");
      }

      setModalVisible(true);
    }, );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Subscription Plans</Text>
      <Text style={styles.subtitle}>
        Choose a plan and pay directly with your mobile airtime.
      </Text>

      {plans.map((plan) => {
        const isSubscribed = subscribedPlan?.id === plan.id;
        return (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
            </View>

            <Text style={styles.planDesc}>{plan.description}</Text>

            <View style={styles.statsRow}>
              <Text style={styles.stat}>
                💬 {plan.messages.toLocaleString()} messages
              </Text>
              <Text style={styles.stat}>
                🛡️ {plan.detections.toLocaleString()} detections
              </Text>
            </View>

            {isSubscribed ? (
              <>
                <View style={styles.subscribedRow}>
                  <Text style={styles.subscribedText}>✅ Subscribed</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.autoRenewText}>Auto-renew</Text>
                    <Switch
                      value={autoRenew}
                      onValueChange={setAutoRenew}
                      thumbColor={autoRenew ? "#16a34a" : "#ccc"}
                    />
                  </View>
                </View>
              </>
            ) : (
              <Pressable
                onPress={() => handleSubscribe(plan)}
                style={({ pressed }) => [
                  styles.subscribeButton,
                  pressed && { opacity: 0.8 },
                ]}
                disabled={loadingPlanId === plan.id}
              >
                {loadingPlanId === plan.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.subscribeText}>Subscribe</Text>
                )}
              </Pressable>
            )}
          </View>
        );
      })}

      {/* Main Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {modalType === "confirm" && (
              <>
                <Text style={styles.modalTitle}>Confirm Payment</Text>
                <Text style={styles.modalText}>
                  You are about to pay{" "}
                  <Text style={styles.bold}>₦{selectedPlan?.price}</Text> for the{" "}
                  <Text style={styles.bold}>{selectedPlan?.name}</Text> plan.
                </Text>

                <View style={styles.modalButtons}>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable onPress={simulatePayment} style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </Pressable>
                </View>
              </>
            )}

            {modalType === "success" && (
              <>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.modalTitle}>Payment Successful</Text>
                <Text style={styles.modalText}>
                  Your {selectedPlan?.name} plan has been activated.
                </Text>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneText}>Done</Text>
                </Pressable>
              </>
            )}

            {modalType === "error" && (
              <>
                <Text style={styles.errorEmoji}>❌</Text>
                <Text style={styles.modalTitle}>Insufficient Balance</Text>
                <Text style={styles.modalText}>
                  Your balance (₦{USER_BALANCE}) is not enough for this plan.
                </Text>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneText}>OK</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Renewal Info Modal */}
      <Modal
        visible={renewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRenewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Renewal Info</Text>
            <Text style={styles.modalText}>
              Your {subscribedPlan?.name} plan will renew on{" "}
              <Text style={styles.bold}>
                {subscribedPlan?.renewalDate?.toLocaleDateString()}
              </Text>
              .
            </Text>
            <Pressable
              onPress={() => setRenewModal(false)}
              style={styles.doneButton}
            >
              <Text style={styles.doneText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  subtitle: { color: "#475569", marginTop: 6, marginBottom: 18 },
  planCard: {
    backgroundColor: "#fbfbff",
    borderWidth: 1,
    borderColor: "#e6edf3",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planName: { fontWeight: "700", fontSize: 16, color: "#0f172a" },
  planPrice: { fontWeight: "700", color: "#16a34a" },
  planDesc: { color: "#64748b", marginTop: 6 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stat: { color: "#0f172a", fontWeight: "600" },
  subscribeButton: {
    marginTop: 14,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  subscribeText: { color: "#fff", fontWeight: "700" },
  subscribedRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subscribedText: { color: "#16a34a", fontWeight: "700" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  autoRenewText: { color: "#0f172a", fontWeight: "600", marginRight: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0f172a",
    marginBottom: 10,
  },
  modalText: { color: "#334155", textAlign: "center" },
  bold: { fontWeight: "700" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: "center",
  },
  cancelText: { color: "#64748b", fontWeight: "700" },
  confirmButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "700" },
  successEmoji: { fontSize: 42, marginBottom: 6 },
  errorEmoji: { fontSize: 42, marginBottom: 6 },
  doneButton: {
    marginTop: 16,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  doneText: { color: "#fff", fontWeight: "700" },
});
