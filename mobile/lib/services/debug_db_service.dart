import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/user_data.dart';
import 'package:mobile/providers/data_provider.dart';

/// デバッグデータベース設定を管理するサービス
class DebugDBService {
  const DebugDBService(this._ref);

  final Ref _ref;

  /// 現在のdevelopDB設定状態を取得する
  Future<bool> isDevelopDBEnabled() async {
    if (!kDebugMode) {
      return false;
    }

    final userData = await _ref.read(userDataRepoProvider).fetch();
    return userData.isDevelopDB;
  }

  /// developDB設定を切り替える
  Future<bool> toggleDevelopDB() async {
    if (!kDebugMode) {
      return false;
    }

    final userDataRepo = _ref.read(userDataRepoProvider);
    final userData = await userDataRepo.fetch();

    final newValue = !userData.isDevelopDB;
    final newUserData = UserData(
      favorites: userData.favorites,
      isDevelopDB: newValue,
    );

    await userDataRepo.save(newUserData);
    return newValue;
  }
}

/// DebugDBServiceのプロバイダー
final debugDBServiceProvider = Provider(DebugDBService.new);
