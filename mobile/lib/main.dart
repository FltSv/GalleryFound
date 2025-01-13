import 'dart:async';
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
import 'package:mobile/theme.dart';

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
        appleProvider: AppleProvider.appAttest,
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
  }).catchError((error, stackTrace) {
    // エラーが発生した場合、エラーダイアログを表示
    FlutterNativeSplash.remove();
    runApp(MaterialApp(home: ErrorDialog(error: error)));
    return Future.value(null);
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final materialTheme = MaterialTheme(textTheme);

    return MaterialApp(
      title: 'Gallery Found',
      theme: materialTheme.light(),
      darkTheme: materialTheme.dark(),
      themeMode: ThemeMode.system,
      home: Builder(
        builder: (context) {
          // アップデートが必要な場合、ポップアップを表示
          if (VersionService.isUpdateRequired) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              VersionService.showUpdatePopup(context);
            });
          }

          return const TopScreen();
        },
      ),
    );
  }
}

class ErrorDialog extends StatelessWidget {
  final Object error;
  const ErrorDialog({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('エラー'),
          content: Text(
            '''アプリ起動時にエラーが発生しました。
下記の情報を support@gallery-found.jp へ送信してください。

$error''',
          ),
        ),
      );
    });

    return const Scaffold();
  }
}
