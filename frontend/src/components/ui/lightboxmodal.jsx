import { useState, useRef } from "react";
import Modal from "./modal";
import PropTypes from "prop-types";

export default function LightboxModal({
  isOpen,
  onClose,
  selectedProof,
  isMobile,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const lightboxContainerRef = useRef(null);
  const lightboxImageRef = useRef(null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (
      !dragStart ||
      !lightboxContainerRef.current ||
      !lightboxImageRef.current
    )
      return;
    const container = lightboxContainerRef.current;
    const image = lightboxImageRef.current;
    let newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = image.clientWidth * zoomLevel;
    const imageHeight = image.clientHeight * zoomLevel;
    const maxPanX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (imageHeight - containerHeight) / 2);
    newPan.x = clamp(newPan.x, -maxPanX, maxPanX);
    newPan.y = clamp(newPan.y, -maxPanY, maxPanY);
    setPan(newPan);
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  const handleTouchStart = (e) => {
    if (zoomLevel <= 1) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e) => {
    if (
      !dragStart ||
      !lightboxContainerRef.current ||
      !lightboxImageRef.current
    )
      return;
    const touch = e.touches[0];
    const container = lightboxContainerRef.current;
    const image = lightboxImageRef.current;
    let newPan = {
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    };
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = image.clientWidth * zoomLevel;
    const imageHeight = image.clientHeight * zoomLevel;
    const maxPanX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (imageHeight - containerHeight) / 2);
    newPan.x = clamp(newPan.x, -maxPanX, maxPanX);
    newPan.y = clamp(newPan.y, -maxPanY, maxPanY);
    setPan(newPan);
  };

  const handleTouchEnd = () => {
    setDragStart(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"}
      modalCenter={false}
      title="IMAGE PREVIEW"
    >
      <div
        ref={lightboxContainerRef}
        className="h-full w-full relative cursor-move select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-2 md:p-5 w-full h-9/10 flex items-center justify-center overflow-hidden">
          <img
            ref={lightboxImageRef}
            src={selectedProof}
            alt="Enlarged proof"
            style={{
              transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
              transition: dragStart ? "none" : "transform 0.2s",
            }}
            className="place-center max-w-full max-h-full object-contain border-2 border-gray-300 rounded-lg"
          />
        </div>
        {!isMobile && (
          <div className="h-1/10 p-2 flex items-center justify-center bg-black bg-opacity-50">
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoomLevel}
              onChange={(e) => {
                const newZoom = Number(e.target.value);
                const adjustedPan = {
                  x: pan.x * (zoomLevel / newZoom),
                  y: pan.y * (zoomLevel / newZoom),
                };
                setZoomLevel(newZoom);
                setPan(adjustedPan);
              }}
              className="w-full"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

LightboxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProof: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
