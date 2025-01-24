import 'package:mobile/models/config.dart';

abstract class ConfigRepoBase {
  Future<Config> getConfig();
  Future<void> init();
}
