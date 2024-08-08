# mobile

Flutter を使用した、GalleryFound のモバイルアプリプロジェクトです。  
ターゲットは Android と iOS です。

## Getting Started

このプロジェクトが初めての Flutter プロジェクトであれば、いくつかのリソースを参考にしてください：

- [Lab：初めての Flutter アプリを書こう](https://docs.flutter.dev/get-started/codelab)
- [Cookbook：便利な Flutter サンプル](https://docs.flutter.dev/cookbook)

Flutter 開発を始めるために、チュートリアル、サンプル、モバイル開発に関するガイダンス、および完全な API リファレンスを提供する[オンラインドキュメント](https://docs.flutter.dev/)をご覧ください。

## How to

### アプリアイコン

`flutter_launcher_icons` を使用しています。

- `mobile\assets\launcher` ディレクトリ直下にアイコンの元画像を配置し、必要に応じて `pubspec.yaml` の `flutter_launcher_icons` を編集します。
- 下記を実行します：
  ```
  flutter pub run flutter_launcher_icons
  ```

### スプラッシュ画面

`flutter_native_splash` を使用しています。

- `mobile\assets\splash` ディレクトリ直下に使用する画像を配置し、必要に応じて `pubspec.yaml` の `flutter_native_splash` を編集します。
- 下記を実行します：
  ```
  flutter pub run flutter_native_splash:create
  ```
