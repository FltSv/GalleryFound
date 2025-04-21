import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/infra/firebase/firebase_config_repo.dart';
import 'package:mobile/infra/firebase/firebase_repo.dart';
import 'package:mobile/models/config.dart';
import 'package:mobile/repos/config_repo_base.dart';
import 'package:mobile/repos/data_repo_base.dart';

const isFake = false;

DataRepoBase getDataRepo(Config config) {
  return isFake ? FakeRepo() : FirebaseRepo(config);
}

ConfigRepoBase getConfigRepo() {
  return FirebaseConfigRepo();
}
