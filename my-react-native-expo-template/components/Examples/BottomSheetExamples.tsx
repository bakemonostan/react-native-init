import BottomSheetWrapper from '@/components/BottomSheetComponents/BottomSheetWrapper';
import HorizontalBottomSheet from '@/components/BottomSheetComponents/HorizontalBottomSheet';
import TipsBottomSheetWrapper from '@/components/BottomSheetComponents/TipsBottomSheetWrapper';
import IconComponent from '@/components/ui/IconComponent';
import PressableComponent from '@/components/ui/PressableComponent';
import { Screen } from '@/components/ui/Screen';
import TextComponent from '@/components/ui/TextComponent';
import { mScale } from '@/constants/mixins';
import { useTheme } from '@/hooks/useTheme';
import type { AppColors } from '@/constants/Colors';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';

function DemoVerticalList({ colors }: { colors: AppColors }) {
  const rows = useMemo(
    () => Array.from({ length: 40 }, (_, i) => `Subcategory ${i + 1}`),
    [],
  );
  return (
    <View style={{ gap: mScale(10) }}>
      {rows.map((label) => (
        <View
          key={label}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: mScale(8),
            paddingVertical: mScale(12),
            paddingHorizontal: mScale(16),
          }}>
          <TextComponent variant='body1Regular'>{label}</TextComponent>
        </View>
      ))}
    </View>
  );
}

export default function BottomSheetExamples() {
  const { colors } = useTheme();

  const headerFooterRef = useRef<BottomSheetModal>(null);
  const footerOnlyRef = useRef<BottomSheetModal>(null);
  const headerOnlyRef = useRef<BottomSheetModal>(null);
  const iconCloseOnlyRef = useRef<BottomSheetModal>(null);
  const horizontalRef = useRef<BottomSheetModal>(null);
  const verticalSingleSnapRef = useRef<BottomSheetModal>(null);
  const tipsRef = useRef<BottomSheetModal>(null);

  const dismiss = (r: React.RefObject<BottomSheetModal | null>) => () =>
    r.current?.dismiss();

  const continueFooter = (r: React.RefObject<BottomSheetModal | null>) => (
    <PressableComponent
      variant='primary'
      buttonText='Continue'
      onPress={dismiss(r)}
    />
  );

  return (
    <Screen
      safeAreaEdges={['bottom']}
      scrollable={false}>
      <View style={{ flex: 1, gap: 12 }}>
        <TextComponent
          size='lg'
          weight='bold'>
          Bottom sheets
        </TextComponent>
        <TextComponent
          size='sm'
          color={colors.textSecondary}>
          Use BottomSheetWrapper for typical sheets (header, scroll body,
          footer). HorizontalBottomSheet is header + horizontal strip only (no
          footer). present() / dismiss(). BottomSheetModalProvider is in the root
          layout.
        </TextComponent>

        <View style={{ gap: 10 }}>
          <PressableComponent
            variant='primary'
            buttonText='1 · Header + footer'
            onPress={() => headerFooterRef.current?.present()}
          />
          <PressableComponent
            variant='secondary'
            buttonText='2 · Footer only'
            onPress={() => footerOnlyRef.current?.present()}
          />
          <PressableComponent
            variant='secondary'
            buttonText='3 · Header only'
            onPress={() => headerOnlyRef.current?.present()}
          />
          <PressableComponent
            variant='muted'
            buttonText='4 · No header/footer — close icon'
            onPress={() => iconCloseOnlyRef.current?.present()}
          />
          <PressableComponent
            variant='outline'
            buttonText='5 · Horizontal scrolling (header only, no footer)'
            onPress={() => horizontalRef.current?.present()}
          />
          <PressableComponent
            variant='outline'
            buttonText='6 · Vertical scroll · single snap (60%)'
            onPress={() => verticalSingleSnapRef.current?.present()}
          />
          <PressableComponent
            variant='secondary'
            buttonText='7 · Tips layout (card + close + footer)'
            onPress={() => tipsRef.current?.present()}
          />
        </View>

        <BottomSheetWrapper
          ref={headerFooterRef}
          title='Header + footer'
          closeText='Close'
          onClose={dismiss(headerFooterRef)}
          snapPoints={['60%']}
          showHeader
          footerContent={continueFooter(headerFooterRef)}>
          <DemoVerticalList colors={colors} />
        </BottomSheetWrapper>

        <BottomSheetWrapper
          ref={footerOnlyRef}
          onClose={dismiss(footerOnlyRef)}
          snapPoints={['55%']}
          showHeader={false}
          footerContent={continueFooter(footerOnlyRef)}>
          <DemoVerticalList colors={colors} />
        </BottomSheetWrapper>

        <BottomSheetWrapper
          ref={headerOnlyRef}
          title='Header only'
          closeText='Close'
          onClose={dismiss(headerOnlyRef)}
          snapPoints={['52%']}
          showHeader>
          <DemoVerticalList colors={colors} />
        </BottomSheetWrapper>

        <BottomSheetWrapper
          ref={iconCloseOnlyRef}
          onClose={dismiss(iconCloseOnlyRef)}
          snapPoints={['48%', '82%']}
          showHeader={false}
          scrollable>
          <Pressable
            onPress={dismiss(iconCloseOnlyRef)}
            hitSlop={12}
            accessibilityRole='button'
            accessibilityLabel='Close sheet'
            style={{ alignSelf: 'flex-end', marginBottom: mScale(12) }}>
            <IconComponent
              library='Ionicons'
              name='close'
              size={26}
              color={colors.text}
            />
          </Pressable>
          <DemoVerticalList colors={colors} />
        </BottomSheetWrapper>

        <HorizontalBottomSheet
          ref={horizontalRef}
          onClose={dismiss(horizontalRef)}
          title='Horizontal scroll'
          snapPoints={['60%']}
          showHeader
        />

        <BottomSheetWrapper
          ref={verticalSingleSnapRef}
          title='Vertical · one snap'
          closeText='Close'
          onClose={dismiss(verticalSingleSnapRef)}
          snapPoints={['60%']}
          showHeader
          footerContent={continueFooter(verticalSingleSnapRef)}>
          <DemoVerticalList colors={colors} />
        </BottomSheetWrapper>

        <TipsBottomSheetWrapper
          ref={tipsRef}
          snapPoints={['25%', '50%']}
          scrollable
          onClose={dismiss(tipsRef)}
          footerContent={
            <PressableComponent
              variant='primary'
              buttonText='Got it'
              onPress={dismiss(tipsRef)}
            />
          }>
          <View style={{ gap: 10, paddingHorizontal: 8, paddingTop: 4 }}>
            <TextComponent
              size='md'
              weight='semi_bold'>
              Tips-style sheet
            </TextComponent>
            <TextComponent
              size='sm'
              color={colors.textSecondary}>
              Grey outer frame, white inner card, top-right close icon, and an
              optional footer. Use scrollable when the body is long.
            </TextComponent>
          </View>
        </TipsBottomSheetWrapper>
      </View>
    </Screen>
  );
}
