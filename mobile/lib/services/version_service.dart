import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:package_info/package_info.dart';
import 'package:pub_semver/pub_semver.dart';
import 'package:url_launcher/url_launcher.dart';

class VersionService {
  static late final bool isUpdateRequired;

  static Future checkUpdateRequired() async {
    // 実行中のアプリバージョンを取得
    final packageInfo = await PackageInfo.fromPlatform();
    final currentVer = Version.parse(packageInfo.version);

    // 要更新バージョンを取得
    final config = ConfigProvider().config;
    final requireVer = Version.parse(config.requiredAppVersion);

    // 実行中バージョンよりも高いバージョンが出ていれば更新を必要とする
    isUpdateRequired = currentVer < requireVer;

    return;
  }

  static void showUpdatePopup(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    final overlay = Overlay.of(context);
    final overlayEntry = OverlayEntry(
      builder: (context) => PopScope(
        onPopInvoked: (didPop) => false, // 戻るボタンを無効化
        child: Material(
          color: Colors.black.withOpacity(0.5), // 背景を暗くする
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      'アップデートのお知らせ',
                      style: textTheme.bodyLarge?.copyWith(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Gap(12),
                    Text('''新しいバージョンが公開されました。
下記のボタンから最新バージョンをインストールしてください。''',
                        style: textTheme.bodyMedium
                            ?.copyWith(color: Colors.black)),
                    const Gap(20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.purple,
                          foregroundColor: Colors.white),
                      onPressed: () {
                        // アップデート処理
                        final newVer =
                            ConfigProvider().config.requiredAppVersion;
                        final url = Uri.parse(
                            'https://github.com/FltSv/GalleryFound/releases/tag/v$newVer');
                        launchUrl(url, mode: LaunchMode.inAppWebView);
                      },
                      child: const Text('アップデート'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    overlay.insert(overlayEntry);
  }
}
