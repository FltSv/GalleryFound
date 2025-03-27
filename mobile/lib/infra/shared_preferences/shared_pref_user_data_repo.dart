import 'dart:convert';
import 'package:mobile/models/user_data.dart';
import 'package:mobile/repos/user_data_repo_base.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SharedPrefUserDataRepo implements UserDataRepoBase {
  final String _key = 'user_data';

  @override
  Future<UserData> fetch() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_key);

    if (jsonString == null) {
      return UserData(favorites: [], isDevelopDB: false);
    }

    final map = json.decode(jsonString) as Map<String, dynamic>;
    return UserData.fromJson(map);
  }

  @override
  Future<void> save(UserData data) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = json.encode(data.toJson());

    await prefs.setString(_key, jsonString);
  }
}
