/// Android/iOSで共通する設定
class Config {
  Config({
    required this.mapUrl,
    required this.debugUserIds,
    required this.requiredAppVersion,
    required this.genres,
    required this.creatorsOrder,
    required this.productsOrder,
    required this.exhibitsOrder,
    required this.isMaintenance,
    required this.maintenanceMessage,
  });

  final String mapUrl;
  final List<String> debugUserIds;
  final String requiredAppVersion;
  final List<String> genres;
  final OrderConfig creatorsOrder;
  final OrderConfig productsOrder;
  final OrderConfig exhibitsOrder;
  final bool isMaintenance;
  final String maintenanceMessage;
}

/// 並び順の設定
class OrderConfig {
  const OrderConfig({
    required this.field,
    required this.isAsc,
  });

  /// ソートの基準となるフィールド名
  final String field;

  /// 昇順かどうか (true: 昇順, false: 降順)
  final bool isAsc;
}
