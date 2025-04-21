import 'package:mobile/infra/factory.dart';
import 'package:mobile/models/config.dart';

class ConfigProvider {
  factory ConfigProvider() => _instance;
  ConfigProvider._();

  // シングルトンのインスタンスを作成
  static final ConfigProvider _instance = ConfigProvider._();

  late Config _config;
  Config get config => _config;

  Future<void> init() async {
    final repo = getConfigRepo();

    await repo.init();
    _config = await repo.getConfig();
  }
}
