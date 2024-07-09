import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gallery Found',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const TopPage(),
    );
  }
}

class TopPage extends StatelessWidget {
  const TopPage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final centerX = screenSize.width / 2;
    final centerY = screenSize.height / 2;
    final buttonSize = screenSize.width * 0.1;
    final radius = screenSize.width * 0.28; // ボタンの配置半径

    //todo ボタン押下時の動作
    booksFunc() => {};
    mapFunc() => {};
    exhibitsFunc() => {};
    creatorsFunc() => {};

    final List<ButtonProp> props = [
      ButtonProp(Icons.menu_book, Colors.green, booksFunc),
      ButtonProp(Icons.location_on, Colors.blue, mapFunc),
      ButtonProp(Icons.brush, Colors.red, exhibitsFunc),
      ButtonProp(Icons.person, Colors.purple, creatorsFunc),
    ];

    return Center(
      child: Container(
        alignment: Alignment.center,
        decoration: const BoxDecoration(
          color: Color(0x413c4300),
          image: DecorationImage(
            image: AssetImage('assets/palette_background.png'),
          ),
        ),
        child: Stack(
          children: props.asMap().entries.map((entry) {
            final index = entry.key;
            final prop = entry.value;

            final angle = (2 * pi * index) / props.length;
            final x = centerX + radius * cos(angle);
            final y = centerY + radius * sin(angle);

            return _iconButton(prop, x, y, buttonSize);
          }).toList(),
        ),
      ),
    );
  }

  Widget _iconButton(ButtonProp prop, double x, double y, double size) {
    return Positioned(
      left: x - size,
      top: y - size,
      child: IconButton.filled(
        icon: Icon(prop.icon),
        iconSize: size,
        padding: EdgeInsets.all(size * 0.5),
        style: IconButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: prop.color,
        ),
        onPressed: prop.onTap,
      ),
    );
  }
}

class ButtonProp {
  final IconData icon;
  final Color color;
  final void Function() onTap;

  ButtonProp(this.icon, this.color, this.onTap);
}
