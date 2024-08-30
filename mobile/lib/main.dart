import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_app_check/firebase_app_check.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:mobile/firebase_options.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/screens/top_screen.dart';
import 'package:mobile/services/version_service.dart';

void main() {
  final widgetBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetBinding);

  Future(() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // AppCheckの初期化
    if (kDebugMode) {
      await FirebaseAppCheck.instance.activate(
        androidProvider: AndroidProvider.debug,
        appleProvider: AppleProvider.debug,
      );
    } else {
      await FirebaseAppCheck.instance.activate(
        androidProvider: AndroidProvider.playIntegrity,
        appleProvider: AppleProvider.deviceCheck,
      );
    }

    // データの取得
    await ConfigProvider().init();
    await DataProvider().fetchData();

    // 更新の確認
    await VersionService.checkUpdateRequired();

    // スプラッシュ画面を解除
    FlutterNativeSplash.remove();
    runApp(const MyApp());
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gallery Found',
      theme: ThemeData.light(useMaterial3: true).copyWith(
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      darkTheme: ThemeData.dark(useMaterial3: true).copyWith(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      themeMode: ThemeMode.system,
      home: Builder(builder: (context) {
        // アップデートが必要な場合、ポップアップを表示
        if (VersionService.isUpdateRequired) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            VersionService.showUpdatePopup(context);
          });
        }

        return const TopScreen();
      }),
    );
  }
}
