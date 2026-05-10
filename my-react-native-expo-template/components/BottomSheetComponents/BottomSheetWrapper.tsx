import { useTheme } from "@/hooks/useTheme";
import { mScale } from "@/utils/scaling";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { ReactNode, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PressableComponent from "../ui/PressableComponent";
import TextComponent from "../ui/TextComponent";

export interface BottomSheetWrapperProps
  extends Omit<BottomSheetModalProps, "children"> {
  /** Content inside the sheet */
  children: ReactNode;
  /** @default "Title" */
  title?: string;
  /** @default "Close" */
  closeText?: string;
  onClose?: () => void;
  /** @default theme `colors.backgroundSecondary` */
  containerBgColor?: string;
  /** @default theme `colors.surface` */
  scrollViewBgColor?: string;
  /** @default true */
  showHeader?: boolean;
  /** @default true */
  scrollable?: boolean;
  footerContent?: ReactNode;
  customHeader?: ReactNode;
  /** @default ["50%"] */
  snapPoints?: (string | number)[];
  /** @default true */
  enablePanDownToClose?: boolean;
  /** @default false */
  enableDynamicSizing?: boolean;
  /** @default 70 (scaled) */
  paddingBottom?: number;
}

/**
 * Modal bottom sheet with header, optional scroll, and optional footer.
 * Use with `BottomSheetModalProvider` and `ref.present()` / `ref.dismiss()`.
 *
 * @example
 * ```tsx
 * const ref = useRef<BottomSheetModal>(null);
 * <BottomSheetWrapper
 *   ref={ref}
 *   title="Example"
 *   onClose={() => ref.current?.dismiss()}
 *   snapPoints={["60%"]}
 * >
 *   <Text>Content</Text>
 * </BottomSheetWrapper>
 * ```
 */
const BottomSheetWrapper = React.forwardRef<
  BottomSheetModal,
  BottomSheetWrapperProps
>(function BottomSheetWrapper(
  {
    children,
    title = "Title",
    closeText = "Close",
    onClose,
    containerBgColor,
    scrollViewBgColor,
    showHeader = true,
    scrollable = true,
    paddingBottom = mScale(70),
    footerContent,
    customHeader,
    snapPoints = ["50%"],
    enablePanDownToClose = true,
    enableDynamicSizing = false,
    ...bottomSheetProps
  },
  ref,
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const resolvedContainerBg = containerBgColor ?? colors.backgroundSecondary;
  const resolvedScrollBg = scrollViewBgColor ?? colors.surface;

  /** Keeps the last row above the sticky footer + home indicator. */
  const scrollContentBottomPad = useMemo(() => {
    if (!footerContent) return mScale(16);
    return mScale(32) + mScale(56) + mScale(24) + insets.bottom;
  }, [footerContent, insets.bottom]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      enableDynamicSizing={enableDynamicSizing}
      handleComponent={null}
      backgroundStyle={[
        styles.sheetChrome,
        { backgroundColor: colors.surface },
      ]}
      {...bottomSheetProps}>
      {showHeader && (
        <View
          style={[styles.headerContainer, { backgroundColor: colors.surface }]}>
          {customHeader ? (
            customHeader
          ) : (
            <>
              <TextComponent variant="h6" text={title} />
              <View style={styles.headerButtons}>
                <PressableComponent
                  variant="ghost"
                  buttonText={closeText}
                  buttonTextColor={colors.primary}
                  labelVariant="body2Medium"
                  size="xs"
                  onPress={handleClose}
                />
              </View>
            </>
          )}
        </View>
      )}

      <View
        style={[
          styles.container,
          {
            backgroundColor: resolvedContainerBg,
            paddingBottom: footerContent ? mScale(12) : paddingBottom,
          },
        ]}>
        <View
          style={[
            styles.scrollViewContainer,
            { backgroundColor: resolvedScrollBg },
          ]}>
          {scrollable ? (
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: scrollContentBottomPad,
              }}>
              {children}
            </BottomSheetScrollView>
          ) : (
            <View>{children}</View>
          )}
        </View>
      </View>

      {footerContent && (
        <View
          style={[
            styles.footerContainer,
            {
              backgroundColor: colors.surface,
              paddingBottom: mScale(16) + insets.bottom,
            },
          ]}>
          {footerContent}
        </View>
      )}
    </BottomSheetModal>
  );
});

export default BottomSheetWrapper;

const styles = StyleSheet.create({
  sheetChrome: {
    borderTopLeftRadius: mScale(12),
    borderTopRightRadius: mScale(12),
    overflow: "hidden",
  },
  container: {
    gap: mScale(24),
    padding: mScale(12),
    flex: 1,
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    borderRadius: mScale(8),
    padding: mScale(12),
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: mScale(12),
    paddingHorizontal: mScale(12),
    borderTopEndRadius: mScale(12),
    borderTopStartRadius: mScale(12),
  },
  headerButtons: {
    flexDirection: "row",
    gap: mScale(8),
    alignItems: "center",
  },
  footerContainer: {
    paddingHorizontal: mScale(12),
    paddingTop: mScale(12),
  },
});
