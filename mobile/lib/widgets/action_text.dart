import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class ActionText extends StatelessWidget {
  const ActionText({
    super.key,
    required this.text,
    required this.onTap,
  });

  final String text;
  final void Function() onTap;

  @override
  Widget build(BuildContext context) {
    return Flexible(
      child: RichText(
        overflow: TextOverflow.fade,
        maxLines: 1,
        softWrap: false,
        text: TextSpan(
          text: text,
          style: const TextStyle(
            color: Colors.blue,
            decoration: TextDecoration.underline,
          ),
          recognizer: TapGestureRecognizer()..onTap = onTap,
        ),
      ),
    );
  }
}
