class Creator {
  Creator({
    required this.id,
    required this.name,
    required this.genre,
    required this.profile,
    required this.profileHashtags,
    required this.links,
    required this.highlightProductId,
    required this.highlightProductUrl,
  });

  final String id;

  /// 作家名
  final String name;

  /// ジャンル
  final String? genre;

  /// プロフィール
  final String profile;

  /// プロフィールに含まれるハッシュタグ
  final List<String> profileHashtags;

  /// SNSリンク
  final List<String> links;

  /// 代表作品ID
  final String? highlightProductId;

  /// 代表作品URL
  final String? highlightProductUrl;
}
