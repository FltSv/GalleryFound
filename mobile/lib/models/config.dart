/// Android/iOSで共通する設定
class Config {
  Config({
    required this.mapUrl,
    required this.debugUserIds,
    required this.requiredAppVersion,
  });

  final String mapUrl;
  final List<String> debugUserIds;
  final String requiredAppVersion;
}
