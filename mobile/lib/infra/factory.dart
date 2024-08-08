import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/infra/firebase/firebase_config_repo.dart';
import 'package:mobile/infra/firebase/firebase_repo.dart';
import 'package:mobile/repos/config_repo_base.dart';
import 'package:mobile/repos/data_repo_base.dart';

class Factory {
  static const isFake = false;

  static DataRepoBase getDataRepo() {
    return isFake ? FakeRepo() : FirebaseRepo();
  }

  static ConfigRepoBase getConfigRepo() {
    // todo ダミーのConfigを作成する
    return isFake ? throw UnimplementedError() : FirebaseConfigRepo();
  }
}
