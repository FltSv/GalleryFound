import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

class CreatorUsecase {
  CreatorUsecase(this._repo);

  final DataRepoBase _repo;

  Future<List<Product>> fetchCreatorProducts(Creator creator) async {
    return _repo.fetchCreatorProducts(creator);
  }

  Future<List<Exhibit>> fetchCreatorExhibits(Creator creator) async {
    return _repo.fetchCreatorExhibits(creator);
  }
}
