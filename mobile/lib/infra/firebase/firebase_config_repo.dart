import 'dart:convert';
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/models/config.dart';
import 'package:mobile/repos/config_repo_base.dart';

class FirebaseConfigRepo implements ConfigRepoBase {
  @override
  Future<Config> getConfig() async {
    final config = FirebaseRemoteConfig.instance;
    await config.fetchAndActivate();

    // ordersのJSONを取得して解析
    final ordersJson =
        json.decode(config.getString('orders')) as Map<String, dynamic>;

    return Config(
      mapUrl: config.getString('map_url'),
      debugUserIds: _getJsonAsList<String>(config, 'debug_user_ids'),
      requiredAppVersion: config.getString('required_app_version'),
      genres: _getJsonAsList(config, 'genres'),
      creatorsOrder: _parseOrderConfig(ordersJson['creators']),
      productsOrder: _parseOrderConfig(ordersJson['products']),
      exhibitsOrder: _parseOrderConfig(ordersJson['exhibits']),
    );
  }

  @override
  Future<void> init() async {
    const minimumFetchInterval =
        kDebugMode ? Duration(minutes: 1) : Duration(hours: 1);

    final config = FirebaseRemoteConfig.instance;
    await config.setConfigSettings(
      RemoteConfigSettings(
        fetchTimeout: const Duration(minutes: 1),
        minimumFetchInterval: minimumFetchInterval,
      ),
    );
  }

  List<T> _getJsonAsList<T>(FirebaseRemoteConfig config, String key) {
    final string = config.getString(key);
    final list = json.decode(string) as List<dynamic>;
    return list.cast<T>();
  }

  OrderConfig _parseOrderConfig(dynamic orderData) {
    final orderDataMap = orderData as Map<String, dynamic>;

    return OrderConfig(
      field: orderDataMap['field'] as String,
      isAsc: orderDataMap['asc'] as bool,
    );
  }
}
