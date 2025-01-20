import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/text_parser.dart';

class LinkableText extends StatelessWidget {
  const LinkableText({
    super.key,
    required this.text,
    this.onHashtagTap,
    this.onUrlTap,
    this.onEmailTap,
  });

  final String text;
  final void Function(String)? onHashtagTap;
  final void Function(String)? onUrlTap;
  final void Function(String)? onEmailTap;

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
            Url() => TextSpan(
                text: element.toString(),
                style: linkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    onUrlTap?.call(element.toString());
                  },
              ),
            Email() => TextSpan(
                text: element.toString(),
                style: linkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    onEmailTap?.call(element.toString());
                  },
              ),
            PlainText() => TextSpan(text: element.value)
          },
        )
        .toList();

    return SelectableText.rich(
      TextSpan(
        // デフォルトのテキストスタイル（サイズや色）を適用させつつ、追加したTextSpanを表示
        style: DefaultTextStyle.of(context).style,
        children: children,
      ),
    );
  }
}
