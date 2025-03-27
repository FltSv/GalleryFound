import 'package:mobile/models/user_data.dart';

abstract class UserDataRepoBase {
  Future<UserData> fetch();
  Future<void> save(UserData data);
}
