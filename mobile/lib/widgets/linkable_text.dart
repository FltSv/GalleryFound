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

    const linkColor = Colors.blue;

    // ハッシュタグ用のスタイル
    const baseLinkStyle = TextStyle(
      color: linkColor,
    );

    // URL用のスタイル
    final underlinedLinkStyle = baseLinkStyle.copyWith(
      decoration: TextDecoration.underline,
      decorationColor: linkColor,
    );

    // 各要素のスタイル
    final hashtagStyle = onHashtagTap == null ? null : baseLinkStyle;
    final urlStyle = onUrlTap == null ? null : underlinedLinkStyle;
    final emailStyle = onEmailTap == null ? null : underlinedLinkStyle;

    // TextSpanのリストを格納する
    final children = parsedText
        .map<InlineSpan>(
          (element) => switch (element) {
            Hashtag() => TextSpan(
                text: element.toString(),
                style: hashtagStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    onHashtagTap?.call(element.trim());
                  },
              ),
            Url() => TextSpan(
                text: element.toString(),
                style: urlStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    onUrlTap?.call(element.toString());
                  },
              ),
            Email() => TextSpan(
                text: element.toString(),
                style: emailStyle,
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
