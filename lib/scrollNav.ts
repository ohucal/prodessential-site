// Smoothly scroll a product detail view (overlay scroller or the window) back
// to the top before swapping in a new product. The swap fires once `watch`
// (the related-items strip the user clicked) has left the viewport — so the
// cards never visibly change under the cursor — or when the scroll finishes or
// stalls, whichever comes first. prefers-reduced-motion gets an instant jump.
export function scrollToTopThen(container: HTMLElement | null, watch: HTMLElement | null, done: () => void) {
  const getTop = () => (container ? container.scrollTop : window.scrollY);
  const scrollTo = (opts: ScrollToOptions) => (container ?? window).scrollTo(opts);

  if (getTop() <= 1) {
    done();
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scrollTo({ top: 0 });
    done();
    return;
  }

  scrollTo({ top: 0, behavior: 'smooth' });

  const viewportBottom = () => (container ? container.getBoundingClientRect().bottom : window.innerHeight);
  const start = performance.now();
  let lastTop = getTop();
  let stalled = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    done();
    // Re-kick the animation on the next frame: swapping the content mid-scroll
    // can cancel an in-flight smooth scroll in some browsers.
    requestAnimationFrame(() => {
      if (getTop() > 0) scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const step = (now: number) => {
    const top = getTop();
    const watchGone = watch ? watch.getBoundingClientRect().top >= viewportBottom() : false;
    if (top <= 0 || watchGone || now - start > 1800) {
      finish();
      return;
    }
    if (top >= lastTop) {
      stalled += 1;
      if (stalled > 30) {
        // Scroll stopped short (user interrupted) — swap anyway.
        finish();
        return;
      }
    } else {
      stalled = 0;
    }
    lastTop = top;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
