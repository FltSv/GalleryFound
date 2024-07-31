import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/repos/data_repo_base.dart';

class Factory {
  static DataRepoBase getDataRepo() {
    return FakeRepo();
  }
}
