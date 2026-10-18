import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign, Contribution } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';

interface BackCampaignModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSuccess: (contribution: Contribution) => void;
}

const PRESET_AMOUNTS = [15, 35, 75, 150];

export const BackCampaignModal: React.FC<BackCampaignModalProps> = ({
  visible,
  campaign,
  onClose,
  onSuccess
}) => {
  const { backCampaign, recordPaymentAttempt, settlePendingContribution } = useCampaigns();

  const [selectedAmount, setSelectedAmount] = useState<number>(35);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [backerName, setBackerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Apple Pay' | 'Google Pay' | 'Credit Card'>('Apple Pay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedContribution, setConfirmedContribution] = useState<Contribution | null>(null);
  const [outcome, setOutcome] = useState<'succeeded' | 'pending' | 'declined' | 'failed'>('succeeded');
  const [failedAttempt, setFailedAttempt] = useState<{ kind: 'pending' | 'declined' | 'failed' | 'cancelled'; contribution: Contribution } | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!campaign) return null;

  const currentAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedAmount;
  const platformFee = Math.round(currentAmount * 0.05 * 100) / 100;
  const netAdSpend = Math.max(Math.round((currentAmount - platformFee) * 100) / 100, 0);
  const perDollar = campaign.targeting.estImpressionsPerDollar || 22;
  const estimatedReach = Math.round(netAdSpend * perDollar);
  const reachLow = Math.round(estimatedReach * 0.6);
  const reachHigh = Math.round(estimatedReach * 1.4);

  const handleSelectPreset = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
  };

  const handleCustomChange = (text: string) => {
    setCustomAmount(text);
    setIsCustom(true);
  };

  const handlePay = () => {
    if (currentAmount < 5) {
      setFormError('The minimum contribution is $5.');
      return;
    }
    setFormError(null);
    setIsProcessing(true);

    // Simulated gateway delay. The outcome is chosen in the demo selector so every state can be shown.
    timerRef.current = setTimeout(async () => {
      timerRef.current = null;
      try {
        if (outcome === 'succeeded') {
          const contribution = await backCampaign(
            campaign.id,
            currentAmount,
            paymentMethod,
            isAnonymous,
            backerName
          );
          setIsProcessing(false);
          setConfirmedContribution(contribution);
          onSuccess(contribution);
        } else {
          const attempt = await recordPaymentAttempt(
            campaign.id,
            currentAmount,
            paymentMethod,
            isAnonymous,
            outcome,
            backerName
          );
          setIsProcessing(false);
          setFailedAttempt({ kind: outcome, contribution: attempt });
        }
      } catch (e) {
        setIsProcessing(false);
        setFormError('We could not record this payment. You were not charged. Please try again.');
      }
    }, 1200);
  };

  const handleCancelPayment = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsProcessing(false);
    try {
      const attempt = await recordPaymentAttempt(
        campaign.id,
        currentAmount,
        paymentMethod,
        isAnonymous,
        'cancelled',
        backerName
      );
      setFailedAttempt({ kind: 'cancelled', contribution: attempt });
    } catch (e) {
      setFormError(null);
    }
  };

  const handleCheckPending = () => {
    if (!failedAttempt) return;
    const pendingId = failedAttempt.contribution.id;
    setIsChecking(true);
    setTimeout(async () => {
      try {
        const settled = await settlePendingContribution(pendingId);
        setIsChecking(false);
        if (settled) {
          setFailedAttempt(null);
          setConfirmedContribution(settled);
          onSuccess(settled);
        }
      } catch (e) {
        setIsChecking(false);
      }
    }, 1000);
  };

  const resetAndClose = () => {
    if (isProcessing || isChecking) return;
    setConfirmedContribution(null);
    setFailedAttempt(null);
    setFormError(null);
    setOutcome('succeeded');
    onClose();
  };

  const handleDone = resetAndClose;

  const FAIL_COPY = {
    pending: {
      icon: 'time-outline',
      color: colors.amberDark,
      title: 'Payment pending',
      body: 'Your bank is still confirming this payment. It will not count toward the campaign’s funding until it is confirmed. You can close this and check the status later in Profile.'
    },
    declined: {
      icon: 'close-circle',
      color: colors.rose,
      title: 'Payment declined',
      body: 'The payment was declined by the provider (simulated). You were not charged, and nothing was added to the campaign’s funding.'
    },
    failed: {
      icon: 'alert-circle',
      color: colors.rose,
      title: 'Payment failed',
      body: 'Something went wrong while processing (simulated). You were not charged, and nothing was added to the campaign’s funding.'
    },
    cancelled: {
      icon: 'remove-circle-outline',
      color: colors.textSecondary,
      title: 'Payment cancelled',
      body: 'You cancelled before the payment finished. You were not charged, and nothing was added to the campaign’s funding.'
    }
  } as const;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Back this campaign</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {campaign.title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={resetAndClose}
              disabled={isProcessing}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {confirmedContribution ? (
            /* Confirmation Success State */
            <ScrollView contentContainerStyle={styles.successContent}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={64} color={colors.accent} />
              </View>

              <Text style={styles.successHeading}>Contribution received</Text>
              <Text style={styles.successDescription}>
                Your ${confirmedContribution.amount} contribution now counts toward this campaign’s funding goal. ${confirmedContribution.netAdSpend} is set aside for advertising. Ads start only after the campaign is funded and distribution setup is complete.
              </Text>

              {/* Impact Banner */}
              <View style={styles.impactCard}>
                <Ionicons name="trending-up-outline" size={24} color={colors.primary} />
                <View style={styles.impactTextContainer}>
                  <Text style={styles.impactNumber}>
                    {Math.round(confirmedContribution.estimatedImpactReach * 0.6).toLocaleString()} to {Math.round(confirmedContribution.estimatedImpactReach * 1.4).toLocaleString()}
                  </Text>
                  <Text style={styles.impactSubtext}>
                    Estimated people reached. An estimate, not a guarantee.
                  </Text>
                </View>
              </View>

              {/* Receipt Summary */}
              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Receipt ID</Text>
                  <Text style={styles.receiptValue}>{confirmedContribution.receiptId}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Payment Method</Text>
                  <Text style={styles.receiptValue}>{confirmedContribution.paymentMethod}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Target Audience</Text>
                  <Text style={styles.receiptValue}>{campaign.targeting.regions.join(', ')}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Status</Text>
                  <Text style={[styles.receiptValue, { color: colors.accentDark }]}>
                    Received (simulated payment)
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleDone}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>View Campaign Progress</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : failedAttempt ? (
            /* Payment not completed: pending, declined, failed or cancelled */
            <ScrollView contentContainerStyle={styles.successContent}>
              <View style={styles.successIconWrapper}>
                <Ionicons
                  name={FAIL_COPY[failedAttempt.kind].icon as any}
                  size={64}
                  color={FAIL_COPY[failedAttempt.kind].color}
                />
              </View>
              <Text style={styles.successHeading}>{FAIL_COPY[failedAttempt.kind].title}</Text>
              <Text style={styles.successDescription}>{FAIL_COPY[failedAttempt.kind].body}</Text>

              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Amount</Text>
                  <Text style={styles.receiptValue}>${failedAttempt.contribution.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Payment method</Text>
                  <Text style={styles.receiptValue}>{failedAttempt.contribution.paymentMethod}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Reference</Text>
                  <Text style={styles.receiptValue}>{failedAttempt.contribution.receiptId}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Counted toward funding</Text>
                  <Text style={[styles.receiptValue, { color: colors.textSecondary }]}>No</Text>
                </View>
              </View>

              {failedAttempt.kind === 'pending' ? (
                <>
                  <TouchableOpacity style={styles.doneBtn} onPress={handleCheckPending} disabled={isChecking} activeOpacity={0.8}>
                    {isChecking ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.doneBtnText}>Check payment status</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={resetAndClose} disabled={isChecking}>
                    <Text style={styles.secondaryBtnText}>Close and check later</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => setFailedAttempt(null)} activeOpacity={0.8}>
                    <Text style={styles.doneBtnText}>Try again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={resetAndClose}>
                    <Text style={styles.secondaryBtnText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          ) : (
            /* Contribution Form State */
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Core Concept Banner */}
              <View style={styles.notDonationBanner}>
                <Ionicons name="information-circle" size={18} color={colors.primaryDark} />
                <Text style={styles.notDonationText}>
                  <Text style={{ fontWeight: '700' }}>Not a direct charity donation.</Text>{' '}
                  Your contribution pays for advertising that shows this message to new people. It is not paid to the creator or to the cause.
                </Text>
              </View>

              {/* Amount Selection */}
              <Text style={styles.sectionLabel}>Select Contribution Amount</Text>
              <View style={styles.presetsGrid}>
                {PRESET_AMOUNTS.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.presetButton,
                      !isCustom && selectedAmount === amount && styles.activePreset
                    ]}
                    onPress={() => handleSelectPreset(amount)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetAmount,
                        !isCustom && selectedAmount === amount && styles.activePresetText
                      ]}
                    >
                      ${amount}
                    </Text>
                    <Text
                      style={[
                        styles.presetReach,
                        !isCustom && selectedAmount === amount && styles.activePresetReach
                      ]}
                    >
                      ~{Math.round(amount * 0.95 * perDollar).toLocaleString()} reach
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Amount */}
              <View style={styles.customAmountRow}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput
                  style={[
                    styles.customInput,
                    isCustom && styles.activeCustomInput
                  ]}
                  placeholder="Or enter custom amount"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={handleCustomChange}
                  onFocus={() => setIsCustom(true)}
                />
              </View>

              {/* Dynamic Estimated Reach Card */}
              <View style={styles.reachEstimateBox}>
                <View style={styles.reachHeaderRow}>
                  <Ionicons name="trending-up" size={18} color={colors.accentDark} />
                  <Text style={styles.reachEstimateTitle}>Estimated reach</Text>
                </View>
                <Text style={styles.reachEstimateBig}>
                  {reachLow.toLocaleString()} to {reachHigh.toLocaleString()} people
                </Text>
                <Text style={styles.reachEstimateDesc}>
                  An estimate from this demo's cost assumptions, not a guarantee. Actual reach depends on ad prices, targeting and delivery.
                </Text>
              </View>

              {/* Breakdown */}
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTitle}>Transparent Fee Breakdown</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Direct Ad Spend (95%)</Text>
                  <Text style={styles.breakdownValue}>${netAdSpend.toFixed(2)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Platform & Processing (5%)</Text>
                  <Text style={styles.breakdownValue}>${platformFee.toFixed(2)}</Text>
                </View>
                <View style={[styles.breakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Charge</Text>
                  <Text style={styles.totalValue}>${currentAmount.toFixed(2)}</Text>
                </View>
              </View>

              {/* Privacy / Backer Identity */}
              <View style={styles.privacySection}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setIsAnonymous(!isAnonymous)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isAnonymous ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.checkboxLabel}>
                    Keep my contribution anonymous (default)
                  </Text>
                </TouchableOpacity>

                {!isAnonymous && (
                  <TextInput
                    style={styles.nameInput}
                    placeholder="Enter your public display name"
                    value={backerName}
                    onChangeText={setBackerName}
                  />
                )}
              </View>

              {/* Payment Method Selector */}
              <Text style={styles.sectionLabel}>Select Simulated Payment</Text>
              <View style={styles.paymentMethodRow}>
                {(['Apple Pay', 'Google Pay', 'Credit Card'] as const).map(pm => (
                  <TouchableOpacity
                    key={pm}
                    style={[
                      styles.paymentMethodBtn,
                      paymentMethod === pm && styles.activePaymentMethod
                    ]}
                    onPress={() => setPaymentMethod(pm)}
                  >
                    <Ionicons
                      name={
                        pm === 'Apple Pay'
                          ? 'logo-apple'
                          : pm === 'Google Pay'
                          ? 'logo-google'
                          : 'card-outline'
                      }
                      size={16}
                      color={paymentMethod === pm ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.paymentMethodText,
                        paymentMethod === pm && styles.activePaymentMethodText
                      ]}
                    >
                      {pm}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Demo-only outcome selector so every payment state can be shown */}
              <Text style={styles.sectionLabel}>Simulated outcome (demo only)</Text>
              <View style={styles.outcomeRow}>
                {([
                  ['succeeded', 'Success'],
                  ['pending', 'Pending'],
                  ['declined', 'Declined'],
                  ['failed', 'Failed']
                ] as const).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.outcomeChip, outcome === key && styles.outcomeChipActive]}
                    onPress={() => setOutcome(key)}
                    disabled={isProcessing}
                  >
                    <Text style={[styles.outcomeChipText, outcome === key && styles.outcomeChipTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.termsNote}>
                Contributions pay for advertising distribution. If a campaign does not reach its goal or is not approved, contributions are refunded. Unspent advertising funds are refunded or reallocated as described under Use of funds.
              </Text>

              {formError && <Text style={styles.errorText}>{formError}</Text>}

              {/* Pay Button */}
              <TouchableOpacity
                style={[styles.payBtn, isProcessing && styles.disabledPayBtn]}
                onPress={handlePay}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="flash" size={18} color="#FFFFFF" />
                    <Text style={styles.payBtnText}>
                      Pay ${currentAmount.toFixed(2)} (simulated)
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {isProcessing && (
                <TouchableOpacity style={styles.secondaryBtn} onPress={handleCancelPayment}>
                  <Text style={styles.secondaryBtnText}>Cancel payment</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  secondaryBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.text },
  errorText: { color: colors.rose, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  termsNote: { fontSize: 12, lineHeight: 18, color: colors.textSecondary, marginBottom: 14 },
  outcomeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  outcomeChip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  outcomeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  outcomeChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  outcomeChipTextActive: { color: colors.primary },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerLeft: {
    flex: 1,
    marginRight: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 20
  },
  notDonationBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary
  },
  notDonationText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  presetButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  activePreset: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  presetAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  activePresetText: {
    color: colors.primary
  },
  presetReach: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  activePresetReach: {
    color: colors.primaryDark,
    fontWeight: '600'
  },
  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: 6
  },
  customInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: colors.text
  },
  activeCustomInput: {
    fontWeight: '600'
  },
  reachEstimateBox: {
    backgroundColor: colors.accentLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDCCD'
  },
  reachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  reachEstimateTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
    textTransform: 'none',
    letterSpacing: 0.3
  },
  reachEstimateBig: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accentDark,
    marginVertical: 4
  },
  reachEstimateDesc: {
    fontSize: 11,
    color: colors.accentDark,
    opacity: 0.9,
    lineHeight: 16
  },
  breakdownCard: {
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'none',
    marginBottom: 8
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  breakdownLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 8
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  privacySection: {
    marginBottom: 16
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  nameInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    marginTop: 10,
    color: colors.text
  },
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  paymentMethodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  activePaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  paymentMethodText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activePaymentMethodText: {
    color: colors.primary
  },
  payBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  disabledPayBtn: {
    opacity: 0.7
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  successContent: {
    padding: 24,
    alignItems: 'center'
  },
  successIconWrapper: {
    marginBottom: 12
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8
  },
  successDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 14,
    width: '100%',
    gap: 12,
    marginBottom: 18
  },
  impactTextContainer: {
    flex: 1
  },
  impactNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark
  },
  impactSubtext: {
    fontSize: 12,
    color: colors.primaryDark,
    marginTop: 2
  },
  receiptBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    padding: 14,
    marginBottom: 20,
    gap: 8
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  receiptLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text
  },
  doneBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
