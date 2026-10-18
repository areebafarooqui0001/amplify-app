import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface StepIndicatorProps {
  currentStep: number; // 1 to 5
}

const STEPS = [
  { step: 1, title: 'Basics', icon: 'create-outline' },
  { step: 2, title: 'Story', icon: 'document-text-outline' },
  { step: 3, title: 'Visuals', icon: 'image-outline' },
  { step: 4, title: 'Reach', icon: 'navigate-outline' },
  { step: 5, title: 'Submit', icon: 'checkmark-circle-outline' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {STEPS.map((s, index) => {
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.completedCircle,
                    isActive && styles.activeCircle
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isActive && styles.activeStepNumber
                      ]}
                    >
                      {s.step}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepTitle,
                    isActive && styles.activeStepTitle,
                    isCompleted && styles.completedStepTitle
                  ]}
                >
                  {s.title}
                </Text>
              </View>

              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted && styles.completedConnector
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepItem: {
    alignItems: 'center'
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  activeCircle: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  completedCircle: {
    borderColor: colors.accent,
    backgroundColor: colors.accent
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  activeStepNumber: {
    color: colors.primary
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted
  },
  activeStepTitle: {
    color: colors.primary,
    fontWeight: '700'
  },
  completedStepTitle: {
    color: colors.textSecondary
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
    marginBottom: 16
  },
  completedConnector: {
    backgroundColor: colors.accent
  }
});
