import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/text_parser.dart';

class LinkableText extends StatelessWidget {
  const LinkableText({
    super.key,
    required this.text,
    this.onHashtagTap,
  });

  final String text;
  final void Function(String)? onHashtagTap;

  @override
  Widget build(BuildContext context) {
    // テキストをパース
    final parsedText = TextParser().parse(text);

    // ハッシュタグ用のスタイル
    const linkStyle = TextStyle(
      color: Colors.blue,
    );

    // TextSpanのリストを格納する
    final children = parsedText
        .map<InlineSpan>(
          (element) => switch (element) {
            Hashtag() => TextSpan(
                text: element.toString(),
                style: linkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    onHashtagTap?.call(element.trim());
                  },
              ),
            PlainText() => TextSpan(
                text: element.value,
                style: DefaultTextStyle.of(context).style,
              )
          },
        )
        .toList();

    return RichText(
      text: TextSpan(
        // デフォルトのテキストスタイル（サイズや色）を適用させつつ、追加したTextSpanを表示
        style: DefaultTextStyle.of(context).style,
        children: children,
      ),
    );
  }
}
