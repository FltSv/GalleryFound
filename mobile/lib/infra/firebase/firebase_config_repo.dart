import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/models/config.dart';
import 'package:mobile/repos/config_repo_base.dart';

class FirebaseConfigRepo implements ConfigRepoBase {
  @override
  Future<Config> getConfig() async {
    final config = FirebaseRemoteConfig.instance;
    await config.fetchAndActivate();

    return Config(
      mapUrl: config.getString("map_url"),
    );
  }

  @override
  Future init() async {
    const minimumFetchInterval =
        kDebugMode ? Duration(minutes: 1) : Duration(hours: 1);

    final config = FirebaseRemoteConfig.instance;
    await config.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(minutes: 1),
      minimumFetchInterval: minimumFetchInterval,
    ));
  }
}
