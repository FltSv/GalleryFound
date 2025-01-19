import 'package:flutter/material.dart';

class NavigateProvider {
  static void push(BuildContext context, Widget screen) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => screen,
      ),
    );
  }
}
