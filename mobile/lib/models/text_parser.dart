/// 正規表現パターンとその種類を管理する列挙型
enum PatternType {
  hashtag(r'([#\s\u3000]#[^\s\u3000#]+)'),
  url(r"https?://[\w!?/+\-_~=;.,*&@#$%()'[\]]+"),
  email(r'[\w+\-._]+@[\w\-._]+\.[A-Za-z]+');

  const PatternType(this.pattern);
  final String pattern;
}

class TextParser {
  /// パターンマッチングの結果からTextSpanTypeを生成
  TextSpanType _createSpanType(String text, PatternType matchedType) =>
      switch (matchedType) {
        PatternType.hashtag => Hashtag(text),
        PatternType.url => Url(text),
        PatternType.email => Email(text),
      };

  /// すべてのパターンを結合した正規表現を生成
  final RegExp _combinedPattern =
      RegExp(PatternType.values.map((type) => '(${type.pattern})').join('|'));

  // パターンマッチングを行い、該当するPatternTypeを特定
  PatternType? _identifyPatternType(String text) {
    for (final type in PatternType.values) {
      if (RegExp(type.pattern).hasMatch(text)) {
        return type;
      }
    }
    return null;
  }

  List<TextSpanType> parse(String text) {
    final result = <TextSpanType>[];

    text.splitMapJoin(
      _combinedPattern,
      onMatch: (Match match) {
        final matchedText = match[0]!;
        final patternType = _identifyPatternType(matchedText);

        if (patternType != null) {
          result.add(_createSpanType(matchedText, patternType));
        }

        return '';
      },
      onNonMatch: (String nonMatch) {
        result.add(PlainText(nonMatch));
        return '';
      },
    );

    return result;
  }
}

class Hashtag extends TextSpanType {
  Hashtag(super.value);

  String trim() => _value.replaceAll(RegExp(r'[\s\u3000]'), '');
}

class Url extends TextSpanType {
  Url(super.value);
}

class Email extends TextSpanType {
  Email(super.value);
}

class PlainText extends TextSpanType {
  PlainText(super.value);
  String get value => super._value;
}

sealed class TextSpanType {
  const TextSpanType(String value) : _value = value;

  final String _value;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Hashtag &&
          runtimeType == other.runtimeType &&
          _value == other._value;

  @override
  int get hashCode => _value.hashCode;

  @override
  String toString() => _value;
}
