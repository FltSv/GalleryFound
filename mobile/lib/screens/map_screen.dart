import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key, this.exhibit});

  final Exhibit? exhibit;
  String get url {
    final eidParam = exhibit != null ? '?eid=${exhibit!.id}' : '';
    return ConfigProvider().config.mapUrl + eidParam;
  }

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
            await controller.reload();
          }
        },
        onGeolocationPermissionsShowPrompt: (controller, origin) async {
          return GeolocationPermissionShowPromptResponse(
            origin: origin,
            allow: true,
            retain: true,
          );
        },
      ),
    );
  }
}
