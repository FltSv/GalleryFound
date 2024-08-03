import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key, this.query = ""});

  final String query;
  String get url => query.isEmpty
      ? 'https://www.google.com/maps'
      : 'https://maps.google.com/maps?q=$query';

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late final WebViewController controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadRequest(Uri.parse(widget.url));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          //title: const Text('Gallery Map'),
          ),
      body: WebViewWidget(controller: controller),
    );
  }
}
