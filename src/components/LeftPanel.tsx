'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { DockerImage } from '@/types/docker';
import { fetchImages } from '@/lib/mock-docker-api';
import { SAMPLE_IMAGE } from '@/lib/fixtures/docker-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DemoOAuthFlow from '@/components/auth/DemoOAuthFlow';

export function LeftPanel() {
  const { setSelectedImage, setContainerStatus } = useAppState();
  const { isAuthenticated, login } = useDemoAuth();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesPerPage, setImagesPerPage] = useState(5);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imageCardsVisible, setImageCardsVisible] = useState<boolean[]>([]);
  const imageListRef = useRef<HTMLDivElement>(null);

  // Fetch images on mount
  useEffect(() => {
    loadImages();
  }, []);

  // Sequential fade-in for image cards when authenticated
  useEffect(() => {
    if (isAuthenticated && images.length > 0) {
      setImageCardsVisible(new Array(images.length).fill(false));
      images.forEach((_, index) => {
        setTimeout(() => {
          setImageCardsVisible(prev => {
            const newVisible = [...prev];
            newVisible[index] = true;
            return newVisible;
          });
        }, index * 150);
      });
    }
  }, [isAuthenticated, images.length]);

  // Calculate how many images can fit in available space
  useEffect(() => {
    const calculateImagesPerPage = () => {
      if (!imageListRef.current) return;

      const containerHeight = imageListRef.current.clientHeight;
      // Each image card is approximately 72px (h-8 icon + padding + text)
      // Add gap of 8px between cards (gap-2)
      const imageCardHeight = 76;
      const gapHeight = 8;
      const paginationHeight = 40; // Pagination controls height

      // Calculate available height for image cards
      const availableHeight = containerHeight - paginationHeight;
      const maxImages = Math.floor(availableHeight / (imageCardHeight + gapHeight));

      // Set between 1-5 images per page
      const calculated = Math.max(1, Math.min(5, maxImages));
      setImagesPerPage(calculated);
    };

    // Initial calculation
    calculateImagesPerPage();

    // Recalculate on window resize
    const resizeObserver = new ResizeObserver(calculateImagesPerPage);
    if (imageListRef.current) {
      resizeObserver.observe(imageListRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedImages = await fetchImages();
      // Filter out sample image from list (shown separately)
      setImages(fetchedImages.filter(img => img.id !== SAMPLE_IMAGE.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image: DockerImage) => {
    setSelectedImageId(image.id);
  };

  const handleRun = () => {
    const selectedImage =
      selectedImageId === SAMPLE_IMAGE.id
        ? SAMPLE_IMAGE
        : images.find(img => img.id === selectedImageId);

    if (selectedImage) {
      setSelectedImage(selectedImage);
      setContainerStatus('building');
      // Auto-transition to running after complete build sequence
      setTimeout(() => {
        setContainerStatus('running');
      }, 20000);
    }
  };

  const handleUseSample = () => {
    setSelectedImageId(SAMPLE_IMAGE.id);
  };

  const handleAuthSuccess = async (username: string) => {
    await login(username);
    setShowAuthModal(false);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1000000;
    return `${mb.toFixed(1)} MB`;
  };

  // Pagination - uses dynamic imagesPerPage
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  // Reset to page 0 if current page exceeds total pages after resize
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
    <div className="fixed left-5 top-[80px] bottom-[60px] w-[253px] bg-black/80 backdrop-blur-sm border border-black flex flex-col z-30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black flex-shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100">Images</h2>
      </div>

      {/* Content - No scrolling, flex layout for vertical responsiveness */}
      <div className="flex-1 px-4 py-3 flex flex-col overflow-hidden">
        {/* Sample Image Option - Fixed size */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/20 p-3 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium text-zinc-300">Sample Image</h3>
              <Badge variant="outline" className="bg-zinc-900/30 text-zinc-400 border-zinc-700 text-[10px] px-1 py-0">
                Recommended
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Try the interface with hello-world
            </p>
            <Button
              onClick={handleUseSample}
              className="bg-zinc-600 hover:bg-zinc-700 text-white w-full text-[10px] h-7"
              size="sm"
            >
              Use Sample
            </Button>
          </div>
        </div>

        {/* Divider - Fixed size */}
        <div className="relative my-3 flex-shrink-0">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-black px-2 text-zinc-500">
              Or choose from your images
            </span>
          </div>
        </div>

        {/* Image List Container - Takes remaining space */}
        <div ref={imageListRef} className="flex-1 min-h-0 flex flex-col">
          {/* Image Cards - Flex container for equal distribution */}
          <div className="flex-1 flex flex-col justify-start gap-2">
            {loading && (
              <div className="text-center py-4 text-zinc-400 text-xs">
                Loading...
              </div>
            )}
            {error && (
              <div className="text-center py-4 text-red-400 text-xs">
                Error: {error}
              </div>
            )}
            {/* Auth Empty State */}
            {!loading && !error && !isAuthenticated && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-xs text-zinc-400 text-center">
                  Auth Docker Hub
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-zinc-600 hover:bg-zinc-700 text-white text-xs h-8 px-6"
                  size="sm"
                >
                  Connect
                </Button>
              </div>
            )}
            {/* Authenticated Image List */}
            {!loading && !error && isAuthenticated && currentImages.map((image, index) => {
              const isSelected = selectedImageId === image.id;
              const isVisible = imageCardsVisible[startIndex + index];
              return (
                <button
                  key={image.id}
                  onClick={() => handleImageSelect(image)}
                  className={`w-full text-left rounded-lg border p-2 transition-all duration-500 flex-shrink-0 ${
                    isSelected
                      ? 'border-white bg-zinc-800/30 hover:bg-zinc-800/50'
                      : 'border-zinc-600 bg-zinc-950/30'
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 flex-shrink-0">
                      <img
                        src="/design-system-lab/docker-logo.svg"
                        alt="Docker"
                        className="h-6 w-6"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs font-medium text-zinc-100 truncate">{image.name}</span>
                        <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] px-1 py-0 flex-shrink-0">
                          {image.tag}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">{image.repository}</p>
                      <p className="text-[10px] text-zinc-600">{formatSize(image.size)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination Controls - Fixed at bottom */}
          {!loading && !error && isAuthenticated && totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 flex-shrink-0">
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[10px] text-zinc-500">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Run button */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-black">
        <Button
          onClick={handleRun}
          disabled={!selectedImageId}
          className="w-full bg-zinc-600 hover:bg-zinc-700 text-white disabled:opacity-50 text-xs h-8"
        >
          Run
        </Button>
      </div>
    </div>

    {/* OAuth Modal - Outside sidebar */}
    {showAuthModal && (
      <DemoOAuthFlow
        onSuccess={handleAuthSuccess}
        onCancel={() => setShowAuthModal(false)}
      />
    )}
    </>
  );
}
