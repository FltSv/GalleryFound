import 'package:flutter/material.dart';

// このファイルは #BB67BF をソースカラーとして下記URLから生成されました:
// This file was generated from the following URL with #BB67BF as the source colour:
// https://material-foundation.github.io/material-theme-builder/

class MaterialTheme {
  final TextTheme textTheme;

  const MaterialTheme(this.textTheme);

  static ColorScheme lightScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff7d4e7d),
      surfaceTint: Color(0xff7d4e7d),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xffffd6fb),
      onPrimaryContainer: Color(0xff320936),
      secondary: Color(0xff6c586a),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xfff5dbf0),
      onSecondaryContainer: Color(0xff261625),
      tertiary: Color(0xff825248),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xffffdad3),
      onTertiaryContainer: Color(0xff33110b),
      error: Color(0xffba1a1a),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffffdad6),
      onErrorContainer: Color(0xff410002),
      surface: Color(0xfffff7fa),
      onSurface: Color(0xff1f1a1f),
      onSurfaceVariant: Color(0xff4d444c),
      outline: Color(0xff7f747c),
      outlineVariant: Color(0xffd0c3cc),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff352e34),
      inversePrimary: Color(0xffedb4eb),
      primaryFixed: Color(0xffffd6fb),
      onPrimaryFixed: Color(0xff320936),
      primaryFixedDim: Color(0xffedb4eb),
      onPrimaryFixedVariant: Color(0xff633664),
      secondaryFixed: Color(0xfff5dbf0),
      onSecondaryFixed: Color(0xff261625),
      secondaryFixedDim: Color(0xffd8bfd4),
      onSecondaryFixedVariant: Color(0xff534152),
      tertiaryFixed: Color(0xffffdad3),
      onTertiaryFixed: Color(0xff33110b),
      tertiaryFixedDim: Color(0xfff6b8ab),
      onTertiaryFixedVariant: Color(0xff673b32),
      surfaceDim: Color(0xffe2d7de),
      surfaceBright: Color(0xfffff7fa),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfffcf0f7),
      surfaceContainer: Color(0xfff6ebf1),
      surfaceContainerHigh: Color(0xfff1e5ec),
      surfaceContainerHighest: Color(0xffebdfe6),
    );
  }

  ThemeData light() {
    return theme(lightScheme());
  }

  static ColorScheme lightMediumContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff5e3260),
      surfaceTint: Color(0xff7d4e7d),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff956495),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff4f3d4e),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff836e81),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff62372f),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff9b685d),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff8c0009),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffda342e),
      onErrorContainer: Color(0xffffffff),
      surface: Color(0xfffff7fa),
      onSurface: Color(0xff1f1a1f),
      onSurfaceVariant: Color(0xff494048),
      outline: Color(0xff665c64),
      outlineVariant: Color(0xff837780),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff352e34),
      inversePrimary: Color(0xffedb4eb),
      primaryFixed: Color(0xff956495),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff7a4b7b),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff836e81),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff6a5668),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff9b685d),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff7f5046),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffe2d7de),
      surfaceBright: Color(0xfffff7fa),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfffcf0f7),
      surfaceContainer: Color(0xfff6ebf1),
      surfaceContainerHigh: Color(0xfff1e5ec),
      surfaceContainerHighest: Color(0xffebdfe6),
    );
  }

  ThemeData lightMediumContrast() {
    return theme(lightMediumContrastScheme());
  }

  static ColorScheme lightHighContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff39113d),
      surfaceTint: Color(0xff7d4e7d),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff5e3260),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff2d1d2c),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff4f3d4e),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff3b1811),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff62372f),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff4e0002),
      onError: Color(0xffffffff),
      errorContainer: Color(0xff8c0009),
      onErrorContainer: Color(0xffffffff),
      surface: Color(0xfffff7fa),
      onSurface: Color(0xff000000),
      onSurfaceVariant: Color(0xff292228),
      outline: Color(0xff494048),
      outlineVariant: Color(0xff494048),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff352e34),
      inversePrimary: Color(0xffffe4fa),
      primaryFixed: Color(0xff5e3260),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff451c48),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff4f3d4e),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff382737),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff62372f),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff48221a),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffe2d7de),
      surfaceBright: Color(0xfffff7fa),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfffcf0f7),
      surfaceContainer: Color(0xfff6ebf1),
      surfaceContainerHigh: Color(0xfff1e5ec),
      surfaceContainerHighest: Color(0xffebdfe6),
    );
  }

  ThemeData lightHighContrast() {
    return theme(lightHighContrastScheme());
  }

  static ColorScheme darkScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xffedb4eb),
      surfaceTint: Color(0xffedb4eb),
      onPrimary: Color(0xff4a204c),
      primaryContainer: Color(0xff633664),
      onPrimaryContainer: Color(0xffffd6fb),
      secondary: Color(0xffd8bfd4),
      onSecondary: Color(0xff3c2b3b),
      secondaryContainer: Color(0xff534152),
      onSecondaryContainer: Color(0xfff5dbf0),
      tertiary: Color(0xfff6b8ab),
      onTertiary: Color(0xff4c261e),
      tertiaryContainer: Color(0xff673b32),
      onTertiaryContainer: Color(0xffffdad3),
      error: Color(0xffffb4ab),
      onError: Color(0xff690005),
      errorContainer: Color(0xff93000a),
      onErrorContainer: Color(0xffffdad6),
      surface: Color(0xff171216),
      onSurface: Color(0xffebdfe6),
      onSurfaceVariant: Color(0xffd0c3cc),
      outline: Color(0xff998d96),
      outlineVariant: Color(0xff4d444c),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffebdfe6),
      inversePrimary: Color(0xff7d4e7d),
      primaryFixed: Color(0xffffd6fb),
      onPrimaryFixed: Color(0xff320936),
      primaryFixedDim: Color(0xffedb4eb),
      onPrimaryFixedVariant: Color(0xff633664),
      secondaryFixed: Color(0xfff5dbf0),
      onSecondaryFixed: Color(0xff261625),
      secondaryFixedDim: Color(0xffd8bfd4),
      onSecondaryFixedVariant: Color(0xff534152),
      tertiaryFixed: Color(0xffffdad3),
      onTertiaryFixed: Color(0xff33110b),
      tertiaryFixedDim: Color(0xfff6b8ab),
      onTertiaryFixedVariant: Color(0xff673b32),
      surfaceDim: Color(0xff171216),
      surfaceBright: Color(0xff3e373c),
      surfaceContainerLowest: Color(0xff120d11),
      surfaceContainerLow: Color(0xff1f1a1f),
      surfaceContainer: Color(0xff241e23),
      surfaceContainerHigh: Color(0xff2e282d),
      surfaceContainerHighest: Color(0xff393338),
    );
  }

  ThemeData dark() {
    return theme(darkScheme());
  }

  static ColorScheme darkMediumContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xfff2b8ef),
      surfaceTint: Color(0xffedb4eb),
      onPrimary: Color(0xff2c0330),
      primaryContainer: Color(0xffb37fb2),
      onPrimaryContainer: Color(0xff000000),
      secondary: Color(0xffddc3d8),
      onSecondary: Color(0xff201120),
      secondaryContainer: Color(0xffa08a9e),
      onSecondaryContainer: Color(0xff000000),
      tertiary: Color(0xfffabcaf),
      onTertiary: Color(0xff2c0c06),
      tertiaryContainer: Color(0xffba8378),
      onTertiaryContainer: Color(0xff000000),
      error: Color(0xffffbab1),
      onError: Color(0xff370001),
      errorContainer: Color(0xffff5449),
      onErrorContainer: Color(0xff000000),
      surface: Color(0xff171216),
      onSurface: Color(0xfffff9fa),
      onSurfaceVariant: Color(0xffd5c7d0),
      outline: Color(0xffac9fa8),
      outlineVariant: Color(0xff8b8088),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffebdfe6),
      inversePrimary: Color(0xff643866),
      primaryFixed: Color(0xffffd6fb),
      onPrimaryFixed: Color(0xff25002a),
      primaryFixedDim: Color(0xffedb4eb),
      onPrimaryFixedVariant: Color(0xff502653),
      secondaryFixed: Color(0xfff5dbf0),
      onSecondaryFixed: Color(0xff1a0c1b),
      secondaryFixedDim: Color(0xffd8bfd4),
      onSecondaryFixedVariant: Color(0xff423141),
      tertiaryFixed: Color(0xffffdad3),
      onTertiaryFixed: Color(0xff250703),
      tertiaryFixedDim: Color(0xfff6b8ab),
      onTertiaryFixedVariant: Color(0xff532b23),
      surfaceDim: Color(0xff171216),
      surfaceBright: Color(0xff3e373c),
      surfaceContainerLowest: Color(0xff120d11),
      surfaceContainerLow: Color(0xff1f1a1f),
      surfaceContainer: Color(0xff241e23),
      surfaceContainerHigh: Color(0xff2e282d),
      surfaceContainerHighest: Color(0xff393338),
    );
  }

  ThemeData darkMediumContrast() {
    return theme(darkMediumContrastScheme());
  }

  static ColorScheme darkHighContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xfffff9fa),
      surfaceTint: Color(0xffedb4eb),
      onPrimary: Color(0xff000000),
      primaryContainer: Color(0xfff2b8ef),
      onPrimaryContainer: Color(0xff000000),
      secondary: Color(0xfffff9fa),
      onSecondary: Color(0xff000000),
      secondaryContainer: Color(0xffddc3d8),
      onSecondaryContainer: Color(0xff000000),
      tertiary: Color(0xfffff9f8),
      onTertiary: Color(0xff000000),
      tertiaryContainer: Color(0xfffabcaf),
      onTertiaryContainer: Color(0xff000000),
      error: Color(0xfffff9f9),
      onError: Color(0xff000000),
      errorContainer: Color(0xffffbab1),
      onErrorContainer: Color(0xff000000),
      surface: Color(0xff171216),
      onSurface: Color(0xffffffff),
      onSurfaceVariant: Color(0xfffff9fa),
      outline: Color(0xffd5c7d0),
      outlineVariant: Color(0xffd5c7d0),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffebdfe6),
      inversePrimary: Color(0xff421945),
      primaryFixed: Color(0xffffddfa),
      onPrimaryFixed: Color(0xff000000),
      primaryFixedDim: Color(0xfff2b8ef),
      onPrimaryFixedVariant: Color(0xff2c0330),
      secondaryFixed: Color(0xfffadff5),
      onSecondaryFixed: Color(0xff000000),
      secondaryFixedDim: Color(0xffddc3d8),
      onSecondaryFixedVariant: Color(0xff201120),
      tertiaryFixed: Color(0xffffe0da),
      onTertiaryFixed: Color(0xff000000),
      tertiaryFixedDim: Color(0xfffabcaf),
      onTertiaryFixedVariant: Color(0xff2c0c06),
      surfaceDim: Color(0xff171216),
      surfaceBright: Color(0xff3e373c),
      surfaceContainerLowest: Color(0xff120d11),
      surfaceContainerLow: Color(0xff1f1a1f),
      surfaceContainer: Color(0xff241e23),
      surfaceContainerHigh: Color(0xff2e282d),
      surfaceContainerHighest: Color(0xff393338),
    );
  }

  ThemeData darkHighContrast() {
    return theme(darkHighContrastScheme());
  }

  ThemeData theme(ColorScheme colorScheme) => ThemeData(
        useMaterial3: true,
        brightness: colorScheme.brightness,
        colorScheme: colorScheme,
        textTheme: textTheme.apply(
          bodyColor: colorScheme.onSurface,
          displayColor: colorScheme.onSurface,
        ),
        scaffoldBackgroundColor: colorScheme.surface,
        canvasColor: colorScheme.surface,
      );

  List<ExtendedColor> get extendedColors => [];
}

class ExtendedColor {
  final Color seed, value;
  final ColorFamily light;
  final ColorFamily lightHighContrast;
  final ColorFamily lightMediumContrast;
  final ColorFamily dark;
  final ColorFamily darkHighContrast;
  final ColorFamily darkMediumContrast;

  const ExtendedColor({
    required this.seed,
    required this.value,
    required this.light,
    required this.lightHighContrast,
    required this.lightMediumContrast,
    required this.dark,
    required this.darkHighContrast,
    required this.darkMediumContrast,
  });
}

class ColorFamily {
  const ColorFamily({
    required this.color,
    required this.onColor,
    required this.colorContainer,
    required this.onColorContainer,
  });

  final Color color;
  final Color onColor;
  final Color colorContainer;
  final Color onColorContainer;
}
