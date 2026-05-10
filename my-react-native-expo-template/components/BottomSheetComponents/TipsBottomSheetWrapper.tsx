import IconComponent from '@/components/ui/IconComponent';
import { mScale } from '@/constants/mixins';
import { useTheme } from '@/hooks/useTheme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import React, { ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TipsBottomSheetWrapperProps extends Omit<
  BottomSheetModalProps,
  'children'
> {
  children: ReactNode;
  /**
   * Called when the close icon is pressed. Usually `() => ref.current?.dismiss()`.
   * Omit when using only `handleClosePress` / footer actions (e.g. login gate).
   */
  onClose?: () => void;
  /** Optional; runs on backdrop tap (before Gorhom’s close), e.g. `dismissAll` + navigation. */
  handleClosePress?: () => void;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
  enableDynamicSizing?: boolean;
  footerContent?: ReactNode;
  /** @default true */
  withCloseIcon?: boolean;
  height?: number | `${number}%`;
  /** @default true */
  enablePanDownToClose?: boolean;
}

/**
 * “Tips” BottomSheetModal: grey chrome, inner white card, optional top-right close, optional footer.
 * Matches the Takers `TipsBottomSheetWrapper` layout (no drag handle — `handleComponent={null}`).
 */
const TipsBottomSheetWrapper = React.forwardRef<
  BottomSheetModal,
  TipsBottomSheetWrapperProps
>(function TipsBottomSheetWrapper(
  {
    snapPoints = ['20%'],
    onClose,
    handleClosePress,
    children,
    enableDynamicSizing,
    footerContent,
    withCloseIcon = true,
    scrollable = false,
    height,
    enablePanDownToClose = true,
    onDismiss,
    backgroundStyle: userBackgroundStyle,
    ...bottomSheetModalProps
  },
  ref,
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        style={styles.backdrop}
        pressBehavior={enablePanDownToClose ? 'close' : 'none'}
        onPress={handleClosePress}
      />
    ),
    [enablePanDownToClose, handleClosePress],
  );

  const outerBg = colors.backgroundSecondary ?? 'rgba(242, 242, 242, 1)';
  const innerBg = colors.surface;

  const body = scrollable ? (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        footerContent ? { paddingBottom: mScale(16) } : null,
      ]}>
      {children}
    </BottomSheetScrollView>
  ) : (
    children
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing ?? false}
      enablePanDownToClose={enablePanDownToClose}
      backgroundStyle={[
        {
          backgroundColor: outerBg,
          borderTopLeftRadius: mScale(16),
          borderTopRightRadius: mScale(16),
        },
        userBackgroundStyle,
      ]}
      {...bottomSheetModalProps}
      handleComponent={null}>
      <BottomSheetView
        style={[
          styles.container,
          height != null ? ({ height } as ViewStyle) : null,
        ]}>
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.content,
              scrollable ? styles.contentFlex : null,
              { backgroundColor: innerBg },
            ]}>
            {withCloseIcon ? (
              <Pressable
                onPress={() => onClose?.()}
                hitSlop={mScale(32)}
                accessibilityRole='button'
                accessibilityLabel='Close'
                style={styles.closeIcon}>
                <IconComponent
                  library='Ionicons'
                  name='close'
                  color={colors.text}
                  size={mScale(20)}
                />
              </Pressable>
            ) : null}
            {body}
          </View>
          {footerContent ? (
            <View
              style={[
                styles.footer,
                { paddingBottom: mScale(16) + insets.bottom },
              ]}>
              {footerContent}
            </View>
          ) : null}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default TipsBottomSheetWrapper;

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    flex: 1,
    padding: mScale(12),
    borderTopLeftRadius: mScale(16),
    borderTopRightRadius: mScale(16),
  },
  content: {
    borderRadius: mScale(8),
    overflow: 'hidden',
  },
  contentFlex: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: mScale(8),
  },
  closeIcon: {
    position: 'absolute',
    top: mScale(12),
    right: mScale(12),
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  footer: {
    marginTop: mScale(12),
    paddingHorizontal: mScale(8),
    paddingTop: mScale(8),
  },
});
