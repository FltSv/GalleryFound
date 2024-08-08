import 'package:mobile/infra/factory.dart';
import 'package:mobile/models/config.dart';

class ConfigProvider {
  // シングルトンのインスタンスを作成
  static final ConfigProvider _instance = ConfigProvider._();
  factory ConfigProvider() => _instance;
  ConfigProvider._();

  late Config _config;
  Config get config => _config;

  Future init() async {
    final repo = Factory.getConfigRepo();

    await repo.init();
    _config = await repo.getConfig();
  }
}
