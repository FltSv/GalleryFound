import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mobile/firebase_options.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/screens/top_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  Future(() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // データの取得
    await DataProvider().fetchData();
  });

  runApp(const MyApp());
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
      home: const TopScreen(),
    );
  }
}
