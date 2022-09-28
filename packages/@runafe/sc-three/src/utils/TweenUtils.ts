import TWEEN from 'tween';

/**
 * 关于场景的利用方法
 */
export default class TweenUtils {
  /**
   * Tween缓动动画。
   * @目标物体
   * @目标变动值
   * @进行中函数
   * @结束函数
   * @时间及缓动类型
   */
  static TweenRun(
    object: any,
    options: any,
    onUpdate: { (obj: any): void; (obj: any): void; (arg0: any): any; },
    onUpdateOption: { p: any; t: any; },
    onCompleteCallback: ((arg0: any) => any) | undefined,
    onCompleteOption: undefined,
    time = 800
  ) {
    TWEEN.remove();
    const tweens = new TWEEN.Tween(object)
      .to(options, time)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        onUpdate && onUpdate(onUpdateOption);
      })
      .onComplete(() => {
        onCompleteCallback && onCompleteCallback(onCompleteOption);
      })
      .start();
    return { TWEEN, tweens };
  }
}
