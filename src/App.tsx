/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PortfolioView } from './components/PortfolioView';
import { CatalogView } from './components/CatalogView';

function isCatalogPath(): boolean {
  return (
    window.location.pathname.toLowerCase().includes('katalog.php') ||
    window.location.hash.toLowerCase().includes('katalog') ||
    window.location.search.toLowerCase().includes('katalog')
  );
}

export default function App() {
  const [view, setView] = useState<'portfolio' | 'catalog'>(() =>
    isCatalogPath() ? 'catalog' : 'portfolio'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onRouteChange = () => {
      setView(isCatalogPath() ? 'catalog' : 'portfolio');
    };
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('hashchange', onRouteChange);
    return () => {
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('hashchange', onRouteChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const navigateToCatalog = () => {
    if (!isCatalogPath()) {
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}${window.location.search}#katalog`
      );
    }
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPortfolio = () => {
    if (isCatalogPath()) {
      const targetUrl = window.location.pathname.toLowerCase().includes('katalog.php')
        ? './'
        : `${window.location.pathname}${window.location.search}`;
      window.history.pushState({}, '', targetUrl);
    }
    setView('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {view === 'portfolio' ? (
        <PortfolioView
          onNavigateCatalog={navigateToCatalog}
          onNotify={showToast}
        />
      ) : (
        <CatalogView
          onBackToPortfolio={navigateToPortfolio}
          onNotify={showToast}
        />
      )}

      {/* Non-intrusive Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[60] max-w-sm bg-[#2A2428] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/15 flex items-center gap-2.5 text-xs sm:text-sm animate-fade-up"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FAF0A1] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
