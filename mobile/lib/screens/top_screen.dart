import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/creator_list_screen.dart';
import 'package:mobile/screens/exhibit_list_screen.dart';
import 'package:mobile/screens/map_screen.dart';
import 'package:mobile/screens/product_list_screen.dart';
import 'package:mobile/widgets/debug_db_button.dart';
import 'package:mobile/widgets/feedback_button.dart';

class TopScreen extends StatelessWidget {
  const TopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final paletteSize = screenSize.width * 0.9;

    final props = <_ButtonProp>[
      _ButtonProp(
        Icons.brush,
        Colors.red,
        const Offset(0.1, 0.55),
        const ExhibitListScreen(),
      ),
      _ButtonProp(
        Icons.person,
        Colors.purple,
        const Offset(0.2, 0.25),
        const CreatorListScreen(),
      ),
      _ButtonProp(
        Icons.collections,
        Colors.green,
        const Offset(0.45, 0.15),
        const ProductListScreen(),
      ),
      _ButtonProp(
        Icons.location_on,
        Colors.blue,
        const Offset(0.7, 0.35),
        const MapScreen(),
      ),
    ];

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: const [0.7, 1.0],
            colors: isDark
                ? [Colors.black, const Color(0xFF382e38)]
                : [Colors.white, const Color(0xFFb3b3b3)],
          ),
        ),
        child: Stack(
          children: [
            // パレットを中央に配置
            Center(
              child: SizedBox(
                width: paletteSize,
                height: paletteSize,
                child: Stack(
                  children: [
                    // パレット本体
                    CustomPaint(
                      painter: PalettePainter(isDark: isDark),
                      child: Container(),
                    ),
                    // パレット上にボタンを配置
                    ...props.map((prop) {
                      return Positioned(
                        left: paletteSize * prop.pos.dx,
                        top: paletteSize * prop.pos.dy,
                        child: _buildPaintBlob(context, prop, 72),
                      );
                    }),
                  ],
                ),
              ),
            ),
            const Positioned(
              right: 32,
              bottom: 32,
              child: FeedbackButton(),
            ),
            // デバッグモードの場合のみDevelopDB切り替えボタンを表示
            if (kDebugMode)
              const Positioned(
                top: 50,
                right: 20,
                child: DebugDBButton(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaintBlob(BuildContext context, _ButtonProp prop, double size) {
    final isEnable = prop.screen != null;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final ratio = isDark ? 0.2 : 0.3;
    final lerpColor = Color.lerp(prop.color, Colors.white, ratio) ?? prop.color;

    return GestureDetector(
      onTap: isEnable
          ? () {
              NavigateProvider.push(context, prop.screen!);
            }
          : null,
      child: Opacity(
        opacity: isEnable ? 1.0 : 0.5,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(-0.2, -0.2),
              radius: 0.3,
              colors: [
                Colors.white.withValues(alpha: 0.8),
                lerpColor,
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 8,
                offset: const Offset(2, 4),
              ),
            ],
          ),
          child: Icon(
            prop.icon,
            size: size * 0.6,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}

class PalettePainter extends CustomPainter {
  PalettePainter({required this.isDark});
  final bool isDark;

  @override
  void paint(Canvas canvas, Size size) {
    // パレットの色をモードで切り替え
    final paletteColors = isDark
        ? [Colors.grey[800]!, Colors.grey[700]!]
        : [Colors.grey[400]!, Colors.grey[300]!];

    // SVGのサイズ
    const svgW = 362.0;
    const svgH = 294.0;

    // アスペクト比を維持して描画領域にフィットさせるためのスケール
    // 幅に合わせる
    final scale = size.width / svgW;

    // キャンバスの原点を中央に移動
    canvas.translate(size.width / 2, size.height / 2);

    final paint = Paint()
      ..shader = ui.Gradient.radial(
        Offset.zero,
        size.width / 2,
        paletteColors,
        [0.0, 1.0],
      )
      ..style = PaintingStyle.fill;

    // SVGパスデータからPathを生成
    // ベジェ曲線の制御点と終点のリスト（SVG座標）
    final cubicPoints = [
      [335.359, 396.964, 260.5, 182.279, 172.5, 254.5],
      [26.7597, 333.488, 0.0, 282.949, 0.0, 182.279],
      [0.0, 81.6092, 87.0002, 0.0, 194.32, 0.0],
      [301.641, 0.0, 362.0, 81.6092, 362.0, 182.279],
    ];

    final path = Path()
      ..moveTo(
        (362.0 - svgW / 2) * scale,
        (182.279 - svgH / 2) * scale,
      );

    // リストを元にパスを追加
    for (final points in cubicPoints) {
      path.cubicTo(
        (points[0] - svgW / 2) * scale,
        (points[1] - svgH / 2) * scale,
        (points[2] - svgW / 2) * scale,
        (points[3] - svgH / 2) * scale,
        (points[4] - svgW / 2) * scale,
        (points[5] - svgH / 2) * scale,
      );
    }

    path.close();
    canvas.drawPath(path, paint);

    // ハイライト
    final highlightPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.05)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    canvas.drawPath(path, highlightPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ButtonProp {
  _ButtonProp(this.icon, this.color, this.pos, this.screen);

  final IconData icon;
  final Color color;
  final Offset pos;
  final Widget? screen;
}
