'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { DockerImage } from '@/types/docker';
import { fetchImages } from '@/lib/mock-docker-api';
import { SAMPLE_IMAGE } from '@/lib/fixtures/docker-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ImageSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageSelectorModal({ open, onOpenChange }: ImageSelectorModalProps) {
  const { setSelectedImage } = useAppState();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch images when modal opens
  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

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

  const handleConfirm = () => {
    const selectedImage =
      selectedImageId === SAMPLE_IMAGE.id
        ? SAMPLE_IMAGE
        : images.find(img => img.id === selectedImageId);

    if (selectedImage) {
      setSelectedImage(selectedImage);
      onOpenChange(false);
    }
  };

  const handleUseSample = () => {
    setSelectedImage(SAMPLE_IMAGE);
    onOpenChange(false);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1000000;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Docker Image</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Choose an image from your Docker Hub account or use a sample image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sample Image Option */}
          <div className="rounded-lg border border-blue-800 bg-blue-950/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-blue-300">Use Sample Image</h3>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700">
                    Recommended
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  Perfect for trying out the interface. Launches hello-world container.
                </p>
              </div>
              <Button
                onClick={handleUseSample}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use Sample
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">
                Or choose from your images
              </span>
            </div>
          </div>

          {/* Image List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="text-center py-8 text-zinc-400">
                Loading images...
              </div>
            )}
            {error && (
              <div className="text-center py-8 text-red-400">
                Error: {error}
              </div>
            )}
            {!loading && !error && images.map((image) => (
              <button
                key={image.id}
                onClick={() => handleImageSelect(image)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  selectedImageId === image.id
                    ? 'border-blue-600 bg-blue-950/30'
                    : 'border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-800">
                      <svg
                        className="h-6 w-6 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.09-.377-2.18-1.99-3.44-2.058-3.49l-.276-.19-.183.275c-.297.446-.505.98-.602 1.545-.166.959-.014 1.925.45 2.735a3.9 3.9 0 01-1.313.469l-13.77.003c-.407 0-.74.334-.74.741-.022.95.11 1.897.397 2.8.346 1.09.955 2.064 1.764 2.82.935.878 2.407 1.653 4.095 1.653.685.006 1.368-.067 2.04-.22 1.146-.26 2.243-.7 3.24-1.3 1.674-1.006 3.055-2.43 4.01-4.123.88.02 2.79.04 3.77-1.89.015-.036.04-.072.06-.108l.105-.18-.152-.096z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-100">{image.name}</span>
                        <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                          {image.tag}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500">{image.repository}</p>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500">{formatSize(image.size)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedImageId}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Select Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
