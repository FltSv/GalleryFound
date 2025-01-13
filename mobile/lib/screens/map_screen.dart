import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key, this.query = ''});

  final String query;
  String get url => query.isEmpty
      ? ConfigProvider().config.mapUrl
      : 'https://maps.google.com/maps?q=$query';

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          //title: const Text('Gallery Map'),
          ),
      body: InAppWebView(
        initialUrlRequest: URLRequest(url: WebUri(widget.url)),
        onWebViewCreated: (controller) async {
          final status = await Permission.locationWhenInUse.request();

          // 権限が許可されてもページは位置情報権限エラーが出たままなのでリロードを行う
          if (status.isGranted) {
            controller.reload();
          }
        },
        onGeolocationPermissionsShowPrompt: (controller, origin) async {
          return GeolocationPermissionShowPromptResponse(
              origin: origin, allow: true, retain: true);
        },
      ),
    );
  }
}
