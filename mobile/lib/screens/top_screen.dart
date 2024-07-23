import 'package:flutter/material.dart';
import 'dart:math';

import 'package:mobile/screens/map_screen.dart';

class TopScreen extends StatelessWidget {
  const TopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final centerX = screenSize.width / 2;
    final centerY = screenSize.height / 2;
    final buttonSize = screenSize.width * 0.1;
    final radius = screenSize.width * 0.28; // ボタンの配置半径

    final List<_ButtonProp> props = [
      _ButtonProp(Icons.menu_book, Colors.green, null),
      _ButtonProp(Icons.location_on, Colors.blue, const MapScreen()),
      _ButtonProp(Icons.brush, Colors.red, null),
      _ButtonProp(Icons.person, Colors.purple, null),
    ];

    return Scaffold(
      body: Container(
        alignment: Alignment.center,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage(Theme.of(context).brightness == Brightness.light
                ? 'assets/palette_background_light.png'
                : 'assets/palette_background_dark.png'),
          ),
        ),
        child: Stack(
          children: props.asMap().entries.map((entry) {
            final index = entry.key;
            final prop = entry.value;

            final angle = (2 * pi * index) / props.length;
            final x = centerX + radius * cos(angle);
            final y = centerY + radius * sin(angle);

            return _iconButton(context, prop, x, y, buttonSize);
          }).toList(),
        ),
      ),
    );
  }

  Widget _iconButton(
      BuildContext context, _ButtonProp prop, double x, double y, double size) {
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
        onPressed: () {
          final screen = prop.screen;
          if (screen == null) return;

          Navigator.of(context).push(
            MaterialPageRoute(
              builder: ((context) => screen),
            ),
          );
        },
      ),
    );
  }
}

class _ButtonProp {
  final IconData icon;
  final Color color;
  final Widget? screen;

  _ButtonProp(this.icon, this.color, this.screen);
}
