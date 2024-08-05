import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/infra/firebase/firebase_repo.dart';
import 'package:mobile/repos/data_repo_base.dart';

class Factory {
  static DataRepoBase getDataRepo() {
    const isFake = false;

    // ignore: dead_code
    return isFake ? FakeRepo() : FirebaseRepo();
  }
}
