'use client';
// Global singletons mounted once for the whole app (home + per-product pages):
// the audio element/engine, persistent player bar, cart drawer, and all modals.
import AudioEngine from './AudioEngine';
import PlayerBar from './PlayerBar';
import CartDrawer from './CartDrawer';
import GlassModal from './GlassModal';
import KitModal from './KitModal';
import LicenseModal from './LicenseModal';
import DeepLink from './DeepLink';

export default function AppChrome() {
  return (
    <>
      <GlassModal />
      <KitModal />
      <LicenseModal />
      <CartDrawer />
      <PlayerBar />
      <AudioEngine />
      <DeepLink />
    </>
  );
}
