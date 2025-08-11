import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:mobile/providers/navigate_provider.dart';

class ButtonProp {
  ButtonProp(this.icon, this.color, this.pos, this.screen);

  final IconData icon;
  final Color color;
  final Offset pos;
  final Widget? screen;
}

class PaintBlobButton extends StatefulWidget {
  const PaintBlobButton({
    super.key,
    required this.prop,
    required this.size,
  });

  final ButtonProp prop;
  final double size;

  @override
  State<PaintBlobButton> createState() => _PaintBlobButtonState();
}

class _PaintBlobButtonState extends State<PaintBlobButton> {
  late final Path _blobPath;

  @override
  void initState() {
    super.initState();
    // 形状が毎フレーム変わらないよう、初期化時に一度だけ生成
    final seed = widget.prop.icon.codePoint ^ widget.prop.color.hashCode;
    _blobPath = _generateTeardropBlob(
      Size.square(widget.size),
      math.Random(seed),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isEnable = widget.prop.screen != null;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: isEnable
          ? () {
              NavigateProvider.push(context, widget.prop.screen!);
            }
          : null,
      child: Opacity(
        opacity: isEnable ? 1.0 : 0.55,
        child: ClipPath(
          clipper: _BlobClipper(_blobPath),
          child: SizedBox(
            width: widget.size,
            height: widget.size,
            child: Stack(
              fit: StackFit.expand,
              children: [
                // 絵の具の本体（グラデーション＋影）
                CustomPaint(
                  painter: _BlobPainter(
                    path: _blobPath,
                    baseColor: widget.prop.color,
                    isDark: isDark,
                  ),
                ),
                // アイコン
                Center(
                  child: Icon(
                    widget.prop.icon,
                    size: widget.size * 0.55,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BlobPainter extends CustomPainter {
  _BlobPainter({
    required this.path,
    required this.baseColor,
    required this.isDark,
  });

  final Path path;
  final Color baseColor;
  final bool isDark;

  @override
  void paint(Canvas canvas, Size size) {
    // ドロップシャドウ（柔らかめ）
    canvas.drawShadow(
      path,
      Colors.black.withValues(alpha: 0.25),
      8,
      false,
    );

    final bounds = path.getBounds();
    final bodyPaint = Paint()
      ..shader = _composeShadedGradient(bounds, baseColor, isDark)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    canvas.drawPath(path, bodyPaint);

    // ブラシハイライト
    _drawBrushHighlight(canvas, path, size);
  }

  void _drawBrushHighlight(Canvas canvas, Path path, Size size) {
    final bounds = path.getBounds();

    // ハイライトのブラシストロークの始点、制御点、終点を定義
    final p0 = Offset(
      bounds.left + bounds.width * 0.2,
      bounds.top + bounds.height * 0.35,
    );
    final p1 = Offset(
      p0.dx + bounds.width * 0.1,
      p0.dy - bounds.height * 0.2,
    );
    final p2 = Offset(
      p0.dx + bounds.width * 0.3,
      p0.dy - bounds.height * 0.2,
    );

    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.1)
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3.5);

    // 複数の短い線分でテーパー効果（徐々に細くなる）を表現
    const steps = 15;
    final maxStroke = size.width * 0.1;
    final minStroke = size.width * 0.01;

    for (var i = 0; i < steps; i++) {
      final t1 = i / steps;
      final t2 = (i + 1) / steps;

      // 2次ベジェ曲線の計算
      Offset pointOnCurve(double t) {
        final x = math.pow(1 - t, 2) * p0.dx +
            2 * (1 - t) * t * p1.dx +
            math.pow(t, 2) * p2.dx;
        final y = math.pow(1 - t, 2) * p0.dy +
            2 * (1 - t) * t * p1.dy +
            math.pow(t, 2) * p2.dy;
        return Offset(x, y);
      }

      final startPoint = pointOnCurve(t1);
      final endPoint = pointOnCurve(t2);

      // dart:uiのlerpDoubleを使用してストローク幅を線形補間
      paint.strokeWidth =
          lerpDouble(maxStroke, minStroke, t1.clamp(0.0, 1.0)) ?? maxStroke;

      canvas.drawLine(startPoint, endPoint, paint);
    }
  }

  // ベースカラーに白をブレンドしたグラデーションを生成
  Shader _composeShadedGradient(Rect bounds, Color color, bool isDark) {
    final deep = Color.lerp(color, Colors.black, 0.1) ?? color;
    return RadialGradient(
      center: const Alignment(-0.35, -0.35),
      radius: 1.1,
      colors: [color, deep],
      stops: const [0.0, 1.0],
    ).createShader(bounds);
  }

  @override
  bool shouldRepaint(covariant _BlobPainter oldDelegate) {
    return oldDelegate.baseColor != baseColor ||
        oldDelegate.isDark != isDark ||
        oldDelegate.path != path;
  }
}

class _BlobClipper extends CustomClipper<Path> {
  _BlobClipper(this.path);
  final Path path;

  @override
  Path getClip(Size size) => path;

  @override
  bool shouldReclip(covariant _BlobClipper oldClipper) => false;
}

// ランダム輪郭のティアドロップ形状を生成
Path _generateTeardropBlob(Size size, math.Random rng) {
  const pointCount = 32; // 輪郭分解能
  final baseRadius = math.min(size.width, size.height) * 0.55;
  final center = Offset(size.width / 2, size.height / 2);

  // ティアドロップの向き（ランダム）
  final tipDirection = rng.nextDouble() * math.pi * 2; // 0..2π
  const tipSigma = math.pi / 4; // 45°にして尖りを広げる
  const tipGain = 0.2; // 伸び率

  final points = <Offset>[];
  for (var i = 0; i < pointCount; i++) {
    final theta = (i / pointCount) * math.pi * 2.0;
    final delta = _angleDelta(theta, tipDirection);
    final w =
        math.exp(-0.5 * (delta * delta) / (tipSigma * tipSigma)); // ガウス分布で尖りを形成
    final noise = (rng.nextDouble() * 2 - 1) * 0.10; // ±0.10程度のゆらぎに抑制
    final r = baseRadius * (1.0 + noise + tipGain * w);
    final x = center.dx + r * math.cos(theta);
    final y = center.dy + r * math.sin(theta);
    points.add(Offset(x, y));
  }

  // Catmull-Rom スプラインで滑らかな閉曲線に
  final path = Path();
  if (points.isEmpty) {
    return path;
  }

  path.moveTo(points[0].dx, points[0].dy);

  Offset p(int idx) => points[(idx + pointCount) % pointCount];

  const tension = 0.35; // テンションを下げて曲率をマイルドに
  for (var i = 0; i < pointCount; i++) {
    final p0 = p(i - 1);
    final p1 = p(i);
    final p2 = p(i + 1);
    final p3 = p(i + 2);

    final c1 = p1 + (p2 - p0) * (tension / 6.0);
    final c2 = p2 - (p3 - p1) * (tension / 6.0);
    path.cubicTo(c1.dx, c1.dy, c2.dx, c2.dy, p2.dx, p2.dy);
  }
  path.close();

  // ほんの少し回転させ自然さを追加
  final rot = (rng.nextDouble() - 0.5) * 0.25; // ±0.125rad
  final m = Matrix4.identity()
    ..translate(center.dx, center.dy)
    ..rotateZ(rot)
    ..translate(-center.dx, -center.dy);
  return path.transform(m.storage);
}

double _angleDelta(double a, double b) {
  var d = (a - b) % (2 * math.pi);

  if (d > math.pi) {
    d -= 2 * math.pi;
  }

  if (d < -math.pi) {
    d += 2 * math.pi;
  }

  return d.abs();
}
