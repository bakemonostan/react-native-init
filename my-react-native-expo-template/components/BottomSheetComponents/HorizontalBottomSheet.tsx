import IconComponent from "@/components/ui/IconComponent";
import { mScale } from "@/constants/mixins";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PressableComponent from "../ui/PressableComponent";
import TextComponent from "../ui/TextComponent";

export interface HorizontalBottomSheetProps {
  onClose: () => void;
  handleSheetChanges?: (index: number) => void;
  title?: string;
  snapPoints?: string[];
  /** @default true */
  showHeader?: boolean;
}

/**
 * Demo sheet: **header** + **horizontal** `BottomSheetScrollView` only (no footer).
 * For vertical lists with footer, use {@link BottomSheetWrapper}.
 */
const HorizontalBottomSheet = React.forwardRef<
  BottomSheetModal,
  HorizontalBottomSheetProps
>(function HorizontalBottomSheet(
  {
    onClose,
    handleSheetChanges: onSheetIndexChange,
    title = "Horizontal",
    snapPoints = ["50%"],
    showHeader = true,
  },
  ref,
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<any>(null);

  const showFloatingClose = !showHeader;

  const data = useMemo(
    () =>
      Array(40)
        .fill(0)
        .map((_, index) => `Subcategory ${index + 1}`),
    [],
  );

  const renderItem = useCallback(
    (item: string) => (
      <View
        key={item}
        style={[
          styles.tipItem,
          { borderColor: colors.border },
          styles.tipItemChip,
          { backgroundColor: colors.backgroundSecondary },
        ]}>
        <TextComponent variant="body1Regular">{item}</TextComponent>
      </View>
    ),
    [colors.border, colors.backgroundSecondary],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const sheetTopRadius = mScale(12);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      enablePanDownToClose
      onChange={onSheetIndexChange}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.sheetBackground,
        {
          backgroundColor: colors.surface,
          borderTopLeftRadius: sheetTopRadius,
          borderTopRightRadius: sheetTopRadius,
        },
      ]}
      handleComponent={null}>
      {showHeader ? (
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: sheetTopRadius,
              borderTopRightRadius: sheetTopRadius,
            },
          ]}>
          <TextComponent variant="h6">{title}</TextComponent>
          <PressableComponent
            variant="ghost"
            buttonText="Close"
            buttonTextColor={colors.primary}
            labelVariant="body2Medium"
            size="xs"
            onPress={onClose}
          />
        </View>
      ) : null}

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: mScale(12) + insets.bottom,
          },
          showHeader ? styles.contentBelowHeader : styles.contentNoHeader,
          !showHeader && {
            borderTopLeftRadius: sheetTopRadius,
            borderTopRightRadius: sheetTopRadius,
            backgroundColor: colors.surface,
          },
        ]}>
        {showFloatingClose ? (
          <View style={styles.floatingCloseRow}>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close sheet">
              <IconComponent
                name="close"
                library="Ionicons"
                size={26}
                color={colors.text}
              />
            </Pressable>
          </View>
        ) : null}
        <View
          style={[
            styles.listWrapper,
            {
              backgroundColor: colors.background,
              marginBottom: showHeader ? mScale(12) : mScale(8),
            },
          ]}>
          <BottomSheetScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              styles.horizontalContent,
              { paddingRight: mScale(24) },
            ]}
            style={styles.flatListStyle}
            focusHook={useFocusEffect}
            bounces={false}>
            {data.map(renderItem)}
          </BottomSheetScrollView>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default HorizontalBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    overflow: "hidden",
  },
  header: {
    padding: mScale(16),
    marginBottom: mScale(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  floatingCloseRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: mScale(12),
    paddingTop: mScale(12),
    paddingBottom: mScale(8),
  },
  tipItem: {
    flexDirection: "row",
    gap: mScale(18),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: mScale(12),
    paddingHorizontal: mScale(16),
    borderRadius: mScale(8),
    borderWidth: 1,
  },
  tipItemChip: {
    minWidth: mScale(130),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: mScale(12),
  },
  contentBelowHeader: {
    paddingTop: mScale(4),
  },
  contentNoHeader: {
    paddingTop: mScale(12),
    overflow: "hidden",
  },
  listWrapper: {
    flex: 1,
    minHeight: mScale(160),
    borderRadius: mScale(16),
  },
  listContent: {
    paddingHorizontal: mScale(24),
    paddingVertical: mScale(8),
  },
  horizontalContent: {
    flexDirection: "row",
    gap: mScale(12),
    alignItems: "center",
  },
  flatListStyle: {
    flex: 1,
  },
});
