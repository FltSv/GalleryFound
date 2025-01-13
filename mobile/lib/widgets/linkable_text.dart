import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class LinkableText extends StatelessWidget {
  final String text;
  final void Function(String)? onHashtagTap;

  const LinkableText({
    super.key,
    required this.text,
    this.onHashtagTap,
  });

  @override
  Widget build(BuildContext context) {
    // ハッシュタグ用のスタイル
    final linkStyle = const TextStyle(
      color: Colors.blue,
    );

    // ハッシュタグをキャッチする正規表現
    final RegExp hashtagRegExp = RegExp(r'([#\s\u3000]#[^#\s\u3000]+)');

    // TextSpanのリストを格納する
    final List<InlineSpan> children = [];

    // splitMapJoin でハッシュタグと通常テキストを分割
    text.splitMapJoin(
      hashtagRegExp,
      onMatch: (Match match) {
        final String matchedText = match[0]!; // "#..." の文字列

        // ハッシュタグ部分：スタイル + タップ可能にする
        children.add(
          TextSpan(
            text: matchedText,
            style: linkStyle,
            recognizer: TapGestureRecognizer()
              ..onTap = () {
                final hashtag =
                    matchedText.replaceAll(RegExp(r'[\s\u3000]'), '');
                onHashtagTap?.call(hashtag);
              },
          ),
        );
        // splitMapJoin用に戻り値を返すが、子要素には追加済みなので空文字列でOK
        return '';
      },
      onNonMatch: (String nonMatch) {
        // 通常テキスト部分
        children.add(
          TextSpan(
            text: nonMatch,
            style: DefaultTextStyle.of(context).style,
          ),
        );
        return '';
      },
    );

    return RichText(
      text: TextSpan(
        // デフォルトのテキストスタイル（サイズや色）を適用させつつ、追加したTextSpanを表示
        style: DefaultTextStyle.of(context).style,
        children: children,
      ),
    );
  }
}
