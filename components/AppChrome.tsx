'use client';
// Global singletons mounted once for the whole app (home + per-product pages):
// the audio element/engine, persistent player bar, cart drawer, and all modals.
import AudioEngine from './AudioEngine';
import PlayerBar from './PlayerBar';
import CartDrawer from './CartDrawer';
import BeatModal from './BeatModal';
import KitModal from './KitModal';
import LicenseModal from './LicenseModal';
import DeepLink from './DeepLink';

export default function AppChrome() {
  return (
    <>
      <BeatModal />
      <KitModal />
      <LicenseModal />
      <CartDrawer />
      <PlayerBar />
      <AudioEngine />
      <DeepLink />
    </>
  );
}
